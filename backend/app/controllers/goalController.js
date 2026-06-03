const Goal = require("../models/Goal");
const Notification = require("../models/Notification")
const {sendNotification} = require("../../utils/socketService");

class GoalController {

  // CREATE GOAL
  async createGoal(req, res) {
    try {
      const {
        title,
        targetAmount,
        savedAmount,
        deadline,
        category,
      } = req.body;

      const goal = await Goal.create({
        user: req.user._id,
        title,
        targetAmount,
        savedAmount,
        deadline,
        category,
      });
      // CREATE NOTIFICATION
            const notification = await Notification.create({
                user: req.user._id,
                title: "New goal created",
                message: `You new goal ₹${title}`,
                isRead: false,
                });
      
            // SOCKET NOTIFICATION
            const socketId = req.app.locals.onlineUsers.get(
              req.user._id.toString()
            );
      
            if (socketId) {
              sendNotification(socketId, notification);
          }

      return res.status(201).json({
        success: true,
        message: "Goal created successfully",
        data: goal,
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }


  // GET ALL GOALS
  async getAllGoals(req, res) {
    try {
      const goals = await Goal.find({
        user: req.user._id,
      }).sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: goals.length,
        data: goals,
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }


  // ADD SAVING
  async addSaving(req, res) {
    try {
      const { amount } = req.body;

      const goal = await Goal.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!goal) {
        return res.status(404).json({
          success: false,
          message: "Goal not found",
        });
      }

      goal.savedAmount += Number(amount);

      if (goal.savedAmount >= goal.targetAmount) {
        goal.status = "Completed";
      }

      await goal.save();

      return res.status(200).json({
        success: true,
        message: "Saving added successfully",
        data: goal,
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // UPDATE GOAL
  async updateGoal(req, res) {
    try {
      const goal = await Goal.findOneAndUpdate(
        {
          _id: req.params.id,
          user: req.user._id,
        },
        req.body,
        {
          new: true,
        }
      );

      return res.status(200).json({
        success: true,
        message: "Goal updated successfully",
        data: goal,
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }


  // DELETE GOAL
  async deleteGoal(req, res) {
    try {
      const goal = await Goal.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!goal) {
        return res.status(404).json({
          success: false,
          message: "Goal not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Goal deleted successfully",
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
};

module.exports = new GoalController();