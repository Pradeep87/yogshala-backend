const express = require("express")
const router = express.Router()
const { isAuthenticatedUser } = require("../middelwares/auth")
const { createHealthIssue, getHealthIssue } = require('../controllers/healthIssue')

router.route("/").post(isAuthenticatedUser, createHealthIssue)
router.route("/").get(isAuthenticatedUser, getHealthIssue)


module.exports = router