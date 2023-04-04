const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    postContent: {
        type: String,
    },
    postMedia: {
        public_id: {
            type: String,
            default: "imgId",
            required: true,
        },
        url: {
            type: String,
            required: true,
            default: "img.png"
        },
    },
    likes: [{
        type: mongoose.Schema.ObjectId,
        ref: "Like",
    }],
    comments: [{
        type: mongoose.Schema.ObjectId,
        ref: "Comment",
    }],
    likesCount: {
        type: Number,
        default: 0,
    },
    commentsCount: {
        type: Number,
        default: 0,
    },
    shareCount: {
        type: Number,
        default: 0,
    },
    visibility: {
        type: Boolean,
        default: true
    },
    tags: [String],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatetedAt: {
        type: Date,
    },
})


module.exports = mongoose.model("Post", postSchema)



