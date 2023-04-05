const express = require("express")
const router = express.Router()
const { isAuthenticatedUser } = require("../middelwares/auth")
const { createHealthIssue } = require('../controllers/healthIssue')

router.route("/").post(isAuthenticatedUser, createHealthIssue)


module.exports = router