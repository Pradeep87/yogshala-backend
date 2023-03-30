const User = require("../models/user")
const catchAsyncError = require("../middelwares/catchAsyncError")

exports.registerUser = catchAsyncError(async (req, res) => {
console.log("controolr")
    const user = await User.create(req.body)
    res.send(user)


})