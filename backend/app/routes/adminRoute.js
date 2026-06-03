const express = require("express");
const authCheck = require("../middlewares/authMiddleaware");
const adminCheck = require("../middlewares/adminMiddleware");
const adminController = require("../controllers/adminController");


const router = express.Router();

// DASHBOARD
router.get("/dashboard", authCheck, adminCheck, adminController.dashboard);
// USERS
router.get("/users", authCheck, adminCheck, adminController.getUsers);
router.put("/block-user/:id", authCheck, adminCheck, adminController.blockUser);
router.delete("/delete-user/:id", authCheck, adminCheck, adminController.deleteUser);

// SUBSCRIPTIONS
router.get("/subscriptions", authCheck, adminCheck,adminController.subscriptions);

// REVENUE
router.get("/revenue", authCheck, adminCheck,  adminController.revenue);

module.exports = router;