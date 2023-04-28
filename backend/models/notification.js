const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    redirectPath: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    notifType: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isSeen: {
        type: Boolean,
        required: true,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})


module.exports = mongoose.model("Notification", notificationSchema)
