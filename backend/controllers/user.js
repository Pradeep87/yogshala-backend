const User = require("../models/user")

exports.registerUser = async (req, res) => {
    try {
        console.log("controller")
        const user = await User.create(req.body)
        res.send(req.body)
    } catch (error) {

    }

}