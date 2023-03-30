const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({

    firstName: {
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
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
    },
    gender: {
        type: String,
        required: [true, "Select Your Gender"],
    },
    birthDay: {
        type: Date,
        required: [true, "Please Enter Your Date of Birth"],
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



// protect password 
userSchema.pre("save", async function name(next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10)
})


// jwt token 
userSchema.methods.getJWTToken = function () {

    return jwt.sign({ id: this._id }, process.env.SECRET_KEY, {
        expiresIn: process.env.TOKEN_EXPIRE
    })
}

// compare password 
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}


// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
    // Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
};




module.exports = mongoose.model("User", userSchema)