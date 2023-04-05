const HealthIssue = require("../models/healthIssues")
const TreatmentPlan = require("../models/treatmentPlan")
const catchAsyncError = require("../middelwares/catchAsyncError")




exports.createHealthIssue = catchAsyncError(async (req, res, next) => {

    const issue = await HealthIssue.create({ user: req.user._id, ...req.body })
    await issue.save();
    res.json({
        success: true,
        issue
    })
})