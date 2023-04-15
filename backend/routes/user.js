const express = require("express")
const router = express.Router()
const { isAuthenticatedUser, authorizedRoles } = require("../middelwares/auth")
const { registerUser, getUsers, getUserDetails, loginUser, logoutUser,updateProfile,updateProfileCover } = require('../controllers/user')



router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/all").get(getUsers)
router.route("/me").get(isAuthenticatedUser,getUserDetails)
router.route("/logout").get(logoutUser)
router.route("/profilepic").put(isAuthenticatedUser,updateProfile);
router.route("/profilecover").put(isAuthenticatedUser,updateProfileCover);


module.exports = router