const Notification = require("../models/Notification");

class NotificationController {
  // GET USER NOTIFICATIONS
  async getNotifications(req, res) {
    try {
      const notifications = await Notification.find({
        user: req.user._id,
      }).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: notifications.length,
        data: notifications,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // MARK AS READ
  async markAsRead(req, res) {
    try {
      const notification = await Notification.findOne({
        _id: req.params.id,
        user: req.user._id,
      });
      if (!notification) {
        return res.status(404).json({
          success: false,
          message: "Notification not found",
        });
      }
      await Notification.findByIdAndUpdate(
        req.params.id,
        {
          isRead: true,
        },
        {
          new: true,
        },
      );
      return res.status(200).json({
        success: true,
        message: "Notification marked as read",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // DELETE NOTIFICATION
  async deleteNotification(req, res) {
    try {
      const notification = await Notification.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: "Notification not found",
        });
      }
      await notification.deleteOne();
      return res.status(200).json({
        success: true,
        message: "Notification deleted",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new NotificationController();
