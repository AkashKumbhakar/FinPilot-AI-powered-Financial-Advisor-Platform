const Budget = require("../models/Budget");
const Expense = require("../models/Expense");
const Notification = require("../models/Notification")
const {sendNotification} = require("../../utils/socketService");

class BudgetController {
  // CREATE BUDGET
  async createBudget(req, res) {
    try {
      const { category, amount, month, year } = req.body;
      // Validation
      if (!category || !amount || !month || !year) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }
      // Check existing budget
      const existingBudget = await Budget.findOne({
        user: req.user._id,
        category,
        month,
        year,
      });
      if (existingBudget) {
        return res.status(400).json({
          success: false,
          message: "Budget already exists for this category and month",
        });
      }
      // Create budget
      const budget = await Budget.create({
        user: req.user._id,
        category,
        amount,
        month,
        year,
      });
      // CREATE NOTIFICATION
      const notification = await Notification.create({
        user: req.user._id,
        title: "Budget Added",
        message: `₹${amount} added for ${category}`,
        isRead: false,
      });

      // SOCKET NOTIFICATION
      const socketId = req.app.locals.onlineUsers.get(req.user._id.toString());

      if (socketId) {
        sendNotification(socketId, notification);
      }
      return res.status(201).json({
        success: true,
        message: "Budget created successfully",
        data: budget,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // GET ALL BUDGETS
  async getAllBudgets(req, res) {
    try {
      const budgets = await Budget.find({ user: req.user._id }).sort({
        createdAt: -1,
      });
      return res.status(200).json({
        success: true,
        count: budgets.length,
        data: budgets,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // UPDATE BUDGET
  async updateBudget(req, res) {
    try {
      const budget = await Budget.findOne({
        _id: req.params.id,
        user: req.user._id,
      });
      if (!budget) {
        return res.status(404).json({
          success: false,
          message: "Budget not found",
        });
      }
      const updatedBudget = await Budget.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        },
      );
      return res.status(200).json({
        success: true,
        message: "Budget updated successfully",
        data: updatedBudget,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // DELETE BUDGET
  async deleteBudget(req, res) {
    try {
      const budget = await Budget.findOne({
        _id: req.params.id,
        user: req.user._id,
      });
      if (!budget) {
        return res.status(404).json({
          success: false,
          message: "Budget not found",
        });
      }
      await budget.deleteOne();
      return res.status(200).json({
        success: true,
        message: "Budget deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  // BUDGET TRACKING
  async budgetTracking(req, res) {
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      // Get budgets
      const budgets = await Budget.find({
        user: req.user._id,
        month: currentMonth,
        year: currentYear,
      });

      const trackingData = [];

      for (const budget of budgets) {
        // Total spent in category
        const expenseData = await Expense.aggregate([
          {
            $match: {
              user: req.user._id,
              category: budget.category,
              expenseDate: {
                $gte: new Date(currentYear, currentMonth - 1, 1),
                $lte: new Date(currentYear, currentMonth, 1),
              },
            },
          },
          {
            $group: {
              _id: null,
              totalSpent: {
                $sum: "$amount",
              },
            },
          },
        ]);
        const totalSpent =
          expenseData.length > 0 ? expenseData[0].totalSpent : 0;
        // Remaining
        const remainingBudget = budget.amount - totalSpent;
        // Status
        let status = "Safe";
        if (totalSpent >= budget.amount) {
          status = "Overspent";
        } else if (totalSpent >= budget.amount * 0.8) {
          status = "Warning";
        }

        trackingData.push({
          category: budget.category,
          budget: budget.amount,
          spent: totalSpent,
          remaining: remainingBudget,
          status,
        });
        // CREATE ALERT
        if (status === "Warning") {
          await Notification.create({
            user: req.user._id,
            title: "Budget Warning",
            message: `You have used 80% of your ${budget.category} budget.`,
            type: "Budget",
          });
          
          // SEND REAL-TIME ALERT
          const socketId = req.app.locals.onlineUsers.get(req.user._id.toString());
          if (socketId) {
            const io = req.app.locals.io;
            io.to(socketId).emit("newNotification", {
  title: "Budget Warning",
  message: `You have used 80% of your ${budget.category} budget.`,
});
          }
        }
        if (status === "Overspent") {
          await Notification.create({
            user: req.user._id,
            title: "Budget Exceeded",
            message: `You exceeded your ${budget.category} budget.`,
            type: "Budget",
          });
          // SEND REAL-TIME ALERT
          const socketId = global.onlineUsers.get(req.user._id.toString());
          if (socketId) {
            global.io.to(socketId).emit("newNotification", notification);
          }
        }
      }
      return res.status(200).json({
        success: true,
        month: currentMonth,
        year: currentYear,
        data: trackingData,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new BudgetController();
