const Post = require("../models/post");
const Like = require("../models/likes");
const Comment = require("../models/comments");
const catchAsyncError = require("../middelwares/catchAsyncError");
const cloudinary = require("cloudinary");
const Notification = require('../models/notification')

exports.doComment = catchAsyncError(async (req, res, next) => {
  const pusher = req.app.get("pusher");
  const { post, commentContent,parentCommentId } = req.body;

if(!parentCommentId){
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
    }
    const isCreated = await Notification.create(notification)
    pusher.trigger(`post-${isPost.user}`, "comment", isCreated);
  }
  res.json({
    success: true,
    message: "Comment Added",
  });
}else{

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
    }
    const isCreated = await Notification.create(notification)
    pusher.trigger(`post-${parentComment.user}`, "comment", isCreated);
  }
  res.json({
    success: true,
    message: "Reply added",
  });
}
 
});

exports.doLike = catchAsyncError(async (req, res, next) => {
  const { post, reaction } = req.body;
  const like = await Like.create({ user: req.user._id, post, reaction });
  await Post.findByIdAndUpdate(
    like.post,
    { $push: { likes: like._id }, $inc: { likesCount: 1 } },
    { new: true }
  );
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

exports.getUserPost = catchAsyncError(async (req, res, next) => {
  const posts = await Post.find({ user: req.user._id })
    .populate("likes")
    .populate("comments");
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
      populate: {
        path: "user",
        select: ["avatar", "firstName", "surname", "_id"],
      },
    })
    .populate("likes")
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
