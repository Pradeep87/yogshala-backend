const User = require("../models/user");
const catchAsyncError = require("../middelwares/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken");
const cloudinary = require("cloudinary");

exports.registerUser = catchAsyncError(async (req, res, next) => {
  const isUser = await User.findOne({ email: req.body.email });
  if (isUser) {
    return next(new ErrorHandler("Email Already Exist", 401));
  } else {
    const user = await User.create(req.body);
    sendToken(user, 201, res);
  }
});

// LOGIN USER
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid email or password ", 401));
  }

  sendToken(user, 200, res);
});

// Logout User
exports.logoutUser = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "User logged Out",
  });
});

// Get User Detail
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

// get users
exports.getUsers = catchAsyncError(async (req, res) => {
  const users = await User.find();
  res.status(201).json({
    success: true,
    total: users.length,
    users,
  });
});

// // update User Profile

exports.updateProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  const imageId = user.avatar.public_id;
  await cloudinary.v2.uploader.destroy(imageId);
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    // width: 180,
    // height: 180,
    crop: "scale",
  });

  user.avatar = {
    public_id: myCloud.public_id,
    url: myCloud.secure_url,
  };
  await user.save();
  res.status(200).json({
    success: true,
    message: "Profile Updated Successfully ",
    avatar: user.avatar,
  });
});

// // update User Profile Cover

exports.updateProfileCover = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const imageId = user.coverPhoto.public_id;
  await cloudinary.v2.uploader.destroy(imageId);
  const myCloud = await cloudinary.v2.uploader.upload(req.body.cover, {
    folder: "coverPhoto",
    // width: 1200,
    // height: 628,
    crop: "scale",
  });

  user.coverPhoto = {
    public_id: myCloud.public_id,
    url: myCloud.secure_url,
  };
  await user.save();
  res.status(200).json({
    success: true,
    message: "Profile Cover Updated Successfully ",
    coverPhoto: user.coverPhoto,
  });
});
