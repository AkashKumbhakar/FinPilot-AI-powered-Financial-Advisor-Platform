const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const User = require("../models/User");
const Expense = require("../models/Expense");
const Income = require("../models/Income");
const Budget = require("../models//Budget");
const RecurringTransaction = require("../models/RecurringTransaction");
const Notification = require("../models/Notification");

class UserController{
    // Get Profile
  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id).select("-password");

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  // UPDATE PROFILE

  async updateProfile(req, res) {
    try {
      const {name,email} = req.body;

      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // CHECK EMAIL ALREADY EXISTS
      if (email && email !== user.email) {

        const existingUser = await User.findOne({ email });

        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: "Email already in use",
          });
        }
      }

      // UPDATE DATA
      user.name = name || user.name;
      user.email = email || user.email;

      await user.save();

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // CHANGE PASSWORD
  async changePassword(req, res) {
    try {
      const {currentPassword, newPassword} = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters",
        });
      }

      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // CHECK CURRENT PASSWORD

      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      // HASH NEW PASSWORD
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      user.password = hashedPassword;
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Password changed successfully",
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  
  // DELETE ACCOUNT
  async deleteAccount(req, res) {
    try {
      const userId = req.user._id;

      // DELETE RELATED DATA
      await Promise.all([
        Expense.deleteMany({user: userId}),
        Income.deleteMany({user: userId}),
        Budget.deleteMany({user: userId}),
        RecurringTransaction.deleteMany({user: userId}),
        Notification.deleteMany({user: userId}),
      ]);

      // DELETE USER

      await User.findByIdAndDelete(userId);

      // CLEAR COOKIE

      res.clearCookie("refreshToken");

      return res.status(200).json({
        success: true,
        message: "Account deleted successfully",
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
};

module.exports = new UserController();