const User = require("../models/user");
const HealthIssue = require("../models/healthIssues");
const Post = require("../models/post");
const Notification = require('../models/notification')
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
      populate: [{
        path: "user",
        select: ["avatar", "firstName", "surname", "_id"],
      }, {
        path: "replies",
        populate: {
          path: "user",
          select: ["avatar", "firstName", "surname", "_id"],
        },
      },]
    })
    .populate({
      path:"likes",
      populate:{
        path: "user",
        select: ["avatar", "firstName", "surname", "_id"],
      }})
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

exports.getUserNotification = catchAsyncError(async (req, res, next) => {

  const notification = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 })
  res.status(200).json({
    success: true,
    total: notification.length,
    notification
  });
});


exports.markNotificationAsSeen = async (req, res, next) => {
  try {
    const notificationId = req.params.id;
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isSeen: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }
    res.json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
