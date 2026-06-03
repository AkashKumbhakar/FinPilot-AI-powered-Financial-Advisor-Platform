const express = require("express");
const authCheck = require("../middlewares/authMiddleaware");
const subscriptionController = require("../controllers/subscriptionController");


const router = express.Router();



router.post("/create-checkout-session", authCheck, subscriptionController.createCheckoutSession);

router.post("/verify-subscription", authCheck, subscriptionController.verifySubscription);

module.exports = router;