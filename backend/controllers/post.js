const Post = require("../models/post")
const catchAsyncError = require("../middelwares/catchAsyncError")
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require('../utils/jwtToken')
const cloudinary = require('cloudinary')



exports.doPost = catchAsyncError(async (req, res, next) => {
    const post = await Post.create({ user: req.user._id, ...req.body })
    res.json({
        success: true,
        post
    })
})