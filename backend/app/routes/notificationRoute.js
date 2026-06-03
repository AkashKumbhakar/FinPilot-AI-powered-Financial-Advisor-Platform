const express = require("express");
const notificationController = require("../controllers/notificationController");
const authCheck = require("../middlewares/authMiddleaware");


const router = express.Router();



// GET NOTIFICATIONS
router.get("/all",authCheck,notificationController.getNotifications);

// MARK AS READ
router.put("/read/:id",authCheck,notificationController.markAsRead);

// DELETE NOTIFICATION
router.delete("/delete/:id",authCheck,notificationController.deleteNotification);

module.exports = router;