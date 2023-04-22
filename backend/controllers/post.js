const Post = require("../models/post")
const Like = require("../models/likes")
const Comment = require("../models/comments")
const catchAsyncError = require("../middelwares/catchAsyncError")
const cloudinary = require("cloudinary");




exports.doComment = catchAsyncError(async (req, res, next) => {

    const { post, commentContent } = req.body;
    const comment = await Comment.create({ user: req.user._id, post, commentContent })

    // Update the comment array in the corresponding Post document
    await Post.findByIdAndUpdate(
        comment.post,
        { $push: { comments: comment._id }, $inc: { commentsCount: 1 } },
        { new: true }
    );

    res.json({
        success: true,
        comment
    })
})


exports.doLike = catchAsyncError(async (req, res, next) => {

    const { post, reaction } = req.body;
    const like = await Like.create({ user: req.user._id, post, reaction })
    // Update the likes array in the corresponding Post document
    await Post.findByIdAndUpdate(
        like.post,
        { $push: { likes: like._id }, $inc: { likesCount: 1 } },
        { new: true }
    );

    res.json({
        success: true,
        like
    })
})


exports.doPost = catchAsyncError(async (req, res, next) => {

    const post = req.body
    const user = req.user._id
    if (req.body.postMedia) {
        const myCloud = await cloudinary.v2.uploader.upload(req.body.postMedia, {
            folder: "posts",
            // width: 180,
            // height: 180,
            crop: "scale",
        });

        post.postMedia = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }
    }

    const newpost = await Post.create({ user, ...post })
    res.status(201).json({
        success: true,
        message: "Post Created Successfully",
        newpost
    })
})

exports.getUserPost = catchAsyncError(async (req, res, next) => {
    const posts = await Post.find({ user: req.user._id }).sort({ createdAt: -1 }).populate('likes').populate('comments')
    res.json({
        success: true,
        total: posts.length,
        posts
    })
})