const express = require("express");
const userController = require("../controllers/userController");
const authCheck = require("../middlewares/authMiddleaware");

const router = express.Router();



router.get("/profile",authCheck , userController.getProfile);
router.put("/update-profile",authCheck,userController.updateProfile);
router.put("/change-password",authCheck,userController.changePassword);
router.delete("/delete-account",authCheck,userController.deleteAccount);

module.exports = router;