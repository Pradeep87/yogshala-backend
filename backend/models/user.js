const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({

    firstname: {
        type: String,
        required: [true, "Please Enter Your First Name"],
    },
    surname: {
        type: String,
        required: [true, "Please Enter Your Surname"],
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
    },
    gender: {
        type: String,
        default: "male"
    },
    birthDay: {
        type: Date,
        required: [false, "Please Enter Your Date of Birth"],
    },
    role: {
        type: String,
        required: true,
        default: "user"
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
            default: "imgID"
        },
        url: {
            type: String,
            required: true,
            default: "img.png"

        },
    },
    coverPhoto: {
        public_id: {
            type: String,
            required: true,
            default: "imgID"
        },
        url: {
            type: String,
            required: true,
            default: "img.png"

        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})



module.exports = mongoose.model("User", userSchema)