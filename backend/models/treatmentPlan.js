const mongoose = require('mongoose');

const treatmentPlanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    instructions: {
        type: String,
    },
    healthIssue: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HealthIssue',
        required: true,
    },
    yogaTeacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'YogaTeacher',
        required: true,
    },
});

const TreatmentPlan = mongoose.model('TreatmentPlan', treatmentPlanSchema);

module.exports = TreatmentPlan;
