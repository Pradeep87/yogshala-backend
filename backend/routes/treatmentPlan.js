const express = require("express")
const router = express.Router()
const { isAuthenticatedUser } = require("../middelwares/auth")
const { createTreatmentPlan } = require('../controllers/treatmentPlan')

router.route("/").post(isAuthenticatedUser, createTreatmentPlan)


module.exports = router