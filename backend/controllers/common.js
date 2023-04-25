const User = require("../models/user");
const HealthIssue = require("../models/healthIssues");
const Post = require("../models/post");

const catchAsyncError = require("../middelwares/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken");
const cloudinary = require("cloudinary");

exports.getUserData = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("-password");
  const posts = await Post.find({ user: req.params.id })
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
  const healthIssues = await HealthIssue.find({ user: req.params.id });
  res.status(200).json({
    success: true,
    user,
    posts,
    healthIssues,
  });
});
