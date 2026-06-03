const express = require("express");
const aiController =require("../controllers/aiController");
const authCheck = require("../middlewares/authMiddleaware");
const subscriptionCheck = require("../middlewares/subscriptionCheck");

const router = express.Router();


router.get("/insights",authCheck, subscriptionCheck,aiController.aiInsights);
router.get("/financial-score", authCheck, aiController.financialScore);
router.get("/spending-analysis", authCheck, aiController.spendingAnalysis);
router.get("/savings-tips", authCheck, aiController.savingsTips);
router.get("/monthly-prediction", authCheck, aiController.monthlyPrediction);
router.post("/chat",authCheck, subscriptionCheck,aiController.aiChat);

module.exports = router;