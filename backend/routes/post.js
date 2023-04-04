const express = require("express")
const router = express.Router()
const { isAuthenticatedUser, authorizedRoles } = require("../middelwares/auth")
const { doPost,getUserPost,doLike } = require('../controllers/post')


router.route("/").post(isAuthenticatedUser, doPost)
router.route("/").get(isAuthenticatedUser, getUserPost)
router.route("/like").post(isAuthenticatedUser, doLike)



module.exports = router