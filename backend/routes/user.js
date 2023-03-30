const express = require("express")
const router = express.Router()
const { registerUser,getUsers,getUserDetails,loginUser,logoutUser } = require('../controllers/user')



router.route("/register").post(registerUser)
router.route("/all").get(getUsers)



module.exports = router