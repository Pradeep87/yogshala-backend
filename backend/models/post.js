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




const likeSchema = new mongoose.Schema({
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
    reaction: {
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


module.exports = mongoose.model("Like", likeSchema)

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

    },
    createdAt: {
        type: Date,
        default: Date.now,
    },



})


module.exports = mongoose.model("Comment", commentSchema)