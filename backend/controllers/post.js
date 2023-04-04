const Post = require("../models/post")
const Like = require("../models/likes")

const catchAsyncError = require("../middelwares/catchAsyncError")
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require('../utils/jwtToken')
const cloudinary = require('cloudinary')



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
    const post = await Post.create({ user: req.user._id, ...req.body })
    res.json({
        success: true,
        post
    })
})



exports.getUserPost = catchAsyncError(async (req, res, next) => {
    const posts = await Post.find({ user: req.user._id }).populate('likes')
    res.json({
        success: true,
        total: posts.length,
        posts
    })
})