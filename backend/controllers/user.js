const User = require("../models/user")

exports.registerUser = async (req, res) => {
    try {
        const user = await User.create(req.body)
        res.send(user)
    } catch (error) {

    }

}