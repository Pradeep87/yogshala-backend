
const mongoose = require('mongoose');

const healthIssueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    severity: {
        type: String,
        required: true,
        enum: ['mild', 'moderate', 'severe'],
    },
    medicalInfo: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    treatmentPlans: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TreatmentPlan',
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const HealthIssue = mongoose.model('HealthIssue', healthIssueSchema);

module.exports = HealthIssue;
