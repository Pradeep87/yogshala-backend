const TreatmentPlan = require("../models/treatmentPlan")
const HealthIssue = require("../models/healthIssues")
const catchAsyncError = require("../middelwares/catchAsyncError")




exports.createTreatmentPlan = catchAsyncError(async (req, res, next) => {
    const {
        healthIssue,
        instructions,
        duration,
        description,
        name } = req.body

    const plan = await TreatmentPlan.create({
        user: req.user._id,
        healthIssue,
        instructions,
        duration,
        description,
        name
    })
    await HealthIssue.findByIdAndUpdate(
        plan.healthIssue,
        { $push: { treatmentPlans: plan._id } },
        { new: true }
    );

    await plan.save();
    res.json({
        success: true,
        plan
    })
})