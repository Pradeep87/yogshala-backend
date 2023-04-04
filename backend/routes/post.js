const express = require("express")
const router = express.Router()
const { isAuthenticatedUser, authorizedRoles } = require("../middelwares/auth")
const { doPost } = require('../controllers/post')


router.route("/").post(isAuthenticatedUser, doPost)



module.exports = router