const express = require("express")
const router = express.Router()
const { isAuthenticatedUser } = require("../middelwares/auth")
const { createHealthIssue, getHealthIssue, getTimelineIssues } = require('../controllers/healthIssue')

router.route("/").post(isAuthenticatedUser, createHealthIssue)
router.route("/").get(isAuthenticatedUser, getHealthIssue)
router.route("/timeline").get(isAuthenticatedUser, getTimelineIssues)


module.exports = router