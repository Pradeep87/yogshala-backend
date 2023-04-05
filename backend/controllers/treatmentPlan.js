const TreatmentPlan = require("../models/treatmentPlan")
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
    await plan.save();
    res.json({
        success: true,
        plan
    })
})