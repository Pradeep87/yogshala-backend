const Post = require("../models/post");
const Like = require("../models/likes");
const Comment = require("../models/comments");
const catchAsyncError = require("../middelwares/catchAsyncError");
const cloudinary = require("cloudinary");
const Notification = require("../models/notification");
const mongoose=require('mongoose')

exports.deletePost = catchAsyncError(async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.user._id;

  const post = await Post.findOne({ _id: postId, user: userId });

  if (!post) {
    return res.status(404).json({ success: false, message: "Post not found" });
  }

  // Delete the post media from Cloudinary
  if (post.postMedia) {
    await cloudinary.uploader.destroy(post.postMedia.public_id);
  }

  // Delete the post likes and comments
  await Like.deleteMany({ post: postId });
  await Comment.deleteMany({ post: postId });
  try {
    // Call deleteOne() on the Mongoose model object instead of remove() on the document object
    await Post.deleteOne({ _id: postId, user: userId });
    res.status(200).json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

exports.getCommentByPost = catchAsyncError(async (req, res, next) => {
  const comments = await Comment.find({ post: req.params.id })
    .sort({ createdAt: -1 })
    .populate({
      path: "replies",
      options: { 
        sort: { createdAt: -1 } 
      },
      populate: {
        path: "user",
        select: ["avatar", "firstName", "surname", "_id"],
      },
    })
    .populate({
      path: "user",
      select: ["avatar", "firstName", "surname", "_id"],
    });

  res.json({
    success: true,
    comments,
  });
});

exports.deleteCommentOrReplyById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  
  // Check if the ID is valid
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID',
    });
  }

  // Try to find the comment or reply by ID
  const comment = await Comment.findOneAndDelete({ _id: id, user: req.user._id });
  const reply = await Comment.findOneAndDelete({ _id: id, user: req.user._id, parentComment: { $exists: true } });
  if (comment.replies.length > 0) {
    await Comment.deleteMany({ _id: { $in: comment.replies } });
  }

  if (!comment && !reply) {
    return res.status(404).json({
      success: false,
      message: 'Comment or reply not found',
    });
  }

  // If a comment was deleted, decrement the commentsCount of the corresponding post
  if (comment) {
    const post = await Post.findByIdAndUpdate(comment.post, { $inc: { commentsCount: -1 } });
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }
  } else {
    // If a reply was deleted, remove its ID from the parent comment's replies array
    const parentComment = await Comment.findByIdAndUpdate(reply.parentComment, { $pull: { replies: reply._id } });
    if (!parentComment) {
      return res.status(404).json({
        success: false,
        message: 'Parent comment not found',
      });
    }
  }

  res.json({
    success: true,
    message: 'Comment or reply deleted',
  });
});

exports.doComment = catchAsyncError(async (req, res, next) => {
  const pusher = req.app.get("pusher");
  const { post, commentContent, parentCommentId } = req.body;

  if (!parentCommentId) {
    const comment = await Comment.create({
      user: req.user._id,
      post,
      commentContent,
    });
    const isPost = await Post.findByIdAndUpdate(
      comment.post,
      { $push: { comments: comment._id }, $inc: { commentsCount: 1 } },
      { new: true }
    );
    if (req.user._id.toString() !== isPost.user.toString()) {
      const notification = {
        user: isPost.user,
        redirectPath: post,
        notifType: "comment",
        message: `${req.user.firstName} ${req.user.surname} commented on your Post`,
      };
      const isCreated = await Notification.create(notification);
      pusher.trigger(`post-${isPost.user}`, "onPost", isCreated);
    }
    res.json({
      success: true,
      message: "Comment Added",
    });
  } else {
    const parentComment = await Comment.findById(parentCommentId);

    if (!parentComment) {
      return res.status(404).json({
        success: false,
        message: "Parent comment not found",
      });
    }

    const reply = await Comment.create({
      user: req.user._id,
      post,
      commentContent,
      parentComment: parentCommentId,
    });

    parentComment.replies.push(reply._id);
    await parentComment.save();
    if (req.user._id.toString() !== parentComment.user.toString()) {
      const notification = {
        user: parentComment.user,
        redirectPath: post,
        notifType: "comment",
        message: `${req.user.firstName} ${req.user.surname} replies on your comment`,
      };
      const isCreated = await Notification.create(notification);
      pusher.trigger(`post-${parentComment.user}`, "onPost", isCreated);
    }
    res.json({
      success: true,
      message: "Reply added",
    });
  }
});

exports.doLike = catchAsyncError(async (req, res, next) => {
  const pusher = req.app.get("pusher");
  const { post, reaction } = req.body;
  const existingLike = await Like.findOne({ user: req.user._id, post });
  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    await Post.findByIdAndUpdate(
      post,
      { $pull: { likes: existingLike._id }, $inc: { likesCount: -1 } },
      { new: true }
    );
    return res.json({
      success: true,
      message: "Like removed successfully",
    });
  }

  const like = await Like.create({ user: req.user._id, post, reaction });
  const isPost = await Post.findByIdAndUpdate(
    like.post,
    { $push: { likes: like._id }, $inc: { likesCount: 1 } },
    { new: true }
  );

  if (req.user._id.toString() !== isPost.user.toString()) {
    const notification = {
      user: isPost.user,
      redirectPath: post,
      notifType: "comment",
      message: `${req.user.firstName} ${req.user.surname} liked your Post`,
    };
    const isCreated = await Notification.create(notification);
    pusher.trigger(`post-${isPost.user}`, "onPost", isCreated);
  }
  res.json({
    success: true,
    like,
  });
});

exports.doPost = catchAsyncError(async (req, res, next) => {
  const post = req.body;
  const user = req.user._id;
  if (req.body.postMedia) {
    const myCloud = await cloudinary.v2.uploader.upload(req.body.postMedia, {
      folder: "posts",
      crop: "scale",
    });
    post.postMedia = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }
  const newpost = await Post.create({ user, ...post });
  res.status(201).json({
    success: true,
    message: "Post Created Successfully",
    newpost,
  });
});

exports.getPostById = catchAsyncError(async (req, res, next) => {
  const post = await Post.findById({ _id: req.params.id })
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: ["avatar", "firstName", "surname", "_id"],
      },
    })
    .populate({
      path: "likes",
      populate: {
        path: "user",
        select: ["avatar", "firstName", "surname", "_id"],
      },
    })
    .populate({
      path: "user",
      select: ["avatar", "firstName", "surname", "_id"],
    });
  res.json({
    success: true,
    post,
  });
});

exports.getUserPost = catchAsyncError(async (req, res, next) => {
  const posts = await Post.find({ user: req.user._id })
  .sort({ createdAt: -1 })
    .populate({
      path: "comments",
      options: { 
        sort: { createdAt: -1 } 
      },
      populate: [
        {
          path: "user",
          select: ["avatar", "firstName", "surname", "_id"],
        },
        {
          path: "replies",
          options: { 
            sort: { createdAt: -1 } 
          },
          populate: {
            path: "user",
            select: ["avatar", "firstName", "surname", "_id"],
          },
        },
      ],
    })
    .populate({
      path: "likes",
      populate: {
        path: "user",
        select: ["avatar", "firstName", "surname", "_id"],
      },
    })
    .populate({
      path: "user",
      select: ["avatar", "_id", "firstName", "surname"],
    });
  res.json({
    success: true,
    total: posts.length,
    posts,
  });
});

exports.getTimelinePost = catchAsyncError(async (req, res, next) => {
  const posts = await Post.find({})
    .sort({ createdAt: -1 })
    .populate({
      path: "comments",
      options: { 
        sort: { createdAt: -1 } 
      },
      populate: [
        {
          path: "user",
          select: ["avatar", "firstName", "surname", "_id"],
        },
        {
          path: "replies",
          options: { 
            sort: { createdAt: -1 } 
          },
          populate: {
            path: "user",
            select: ["avatar", "firstName", "surname", "_id"],
          },
        },
      ],
    })
    .populate({
      path: "likes",
      populate: {
        path: "user",
        select: ["avatar", "firstName", "surname", "_id"],
      },
    })
    .populate({
      path: "user",
      select: ["avatar", "_id", "firstName", "surname"],
    });
  res.json({
    success: true,
    total: posts.length,
    posts,
  });
});
