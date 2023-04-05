const express = require("express")
const router = express.Router()
const { isAuthenticatedUser } = require("../middelwares/auth")
const { createTreatmentPlan, getTreatmentPlan } = require('../controllers/treatmentPlan')

router.route("/").post(isAuthenticatedUser, createTreatmentPlan)
router.route("/").get(isAuthenticatedUser, getTreatmentPlan)


module.exports = router