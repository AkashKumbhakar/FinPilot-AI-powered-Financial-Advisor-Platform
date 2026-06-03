const express = require("express");
const authController = require("../controllers/authController");
const authCheck = require("../middlewares/authMiddleaware");

const router = express.Router();

router.post("/register", authController.register);
router.post("/verify-otp",authController.verifyOTP);
router.post("/resend-otp",authController.resendOTP);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/refresh-token", authController.refreshAccessToken);
router.post("/forgot-password",authController.forgotPassword);
router.post("/reset-password/:token",authController.resetPassword);


module.exports = router;