const express = require("express");
const reportController = require("../controllers/reportController");
const authCheck = require("../middlewares/authMiddleaware");
const subscriptionCheck = require("../middlewares/subscriptionCheck");


const router = express.Router();



// GENERATE REPORT
router.get("/financial-report",authCheck,subscriptionCheck,reportController.generateFinancialReport);

module.exports = router;