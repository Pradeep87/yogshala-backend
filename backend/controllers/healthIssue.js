const HealthIssue = require("../models/healthIssues");
const TreatmentPlan = require("../models/treatmentPlan");
const catchAsyncError = require("../middelwares/catchAsyncError");

exports.createHealthIssue = catchAsyncError(async (req, res, next) => {
  const issue = await HealthIssue.create({ user: req.user._id, ...req.body });
  await issue.save();
  res.json({
    success: true,
    message:"Issue Created"
  });
});

exports.getHealthIssue = catchAsyncError(async (req, res, next) => {
  const issues = await HealthIssue.find({ user: req.user._id })
    .populate({
      path: "treatmentPlans",
      populate: {
        path: "user",
        select: ["avatar", "firstName", "surname", "_id"],
      },
    })
    .populate({
      path: "user",
      select: ["avatar", "firstName", "surname", "_id"],
    }).sort({ createdAt: -1 });
  res.json({
    success: true,
    issues,
  });
});


exports.getTimelineIssues = catchAsyncError(async (req, res, next) => {
  const issues = await HealthIssue.find({})
    .populate({
      path: "treatmentPlans",
      populate: {
        path: "user",
        select: ["avatar", "firstName", "surname", "_id"],
      },
    })
    .populate({
      path: "user",
      select: ["avatar", "firstName", "surname", "_id"],
    }).sort({ createdAt: -1 });
  res.json({
    success: true,
    issues,
  });
});
