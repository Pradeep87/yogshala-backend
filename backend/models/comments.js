const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    post: {
        type: mongoose.Schema.ObjectId,
        ref: "Post",
        required: true,
    },
    commentContent: {
        type: String,
        default: "like"
    },
    visibility: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },



})


module.exports = mongoose.model("Comment", commentSchema)