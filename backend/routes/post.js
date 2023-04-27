const express = require("express")
const router = express.Router()
const { isAuthenticatedUser, authorizedRoles } = require("../middelwares/auth")
const { doPost, getUserPost, doLike, doComment, getTimelinePost } = require('../controllers/post')


router.route("/").post(isAuthenticatedUser, doPost)
router.route("/").get(isAuthenticatedUser, getUserPost)
router.route("/like").post(isAuthenticatedUser, doLike)
router.route("/comment").post(isAuthenticatedUser, doComment)
router.route("/timeline").get(isAuthenticatedUser, getTimelinePost)



module.exports = router