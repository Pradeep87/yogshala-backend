const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Please Enter Your First Name"],
    },
    surname: {
        type: String,
        required: [true, "Please Enter Your First Name"],
    }


})
