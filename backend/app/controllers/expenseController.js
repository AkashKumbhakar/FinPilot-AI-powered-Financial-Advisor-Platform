const Expense = require("../models/Expense");
const Notification = require("../models/Notification")
const {sendNotification} = require("../../utils/socketService");

class ExpenseController {
  // CREATE EXPENSE
  async createExpense(req, res) {
    try {
      const {
        title,
        amount,
        category,
        paymentMethod,
        notes,
        expenseDate,
        isRecurring,
        recurringType,
      } = req.body;

      // Validation
      if (!title || !amount || !category) {
        return res.status(400).json({
          success: false,
          message: "Title, amount and category are required",
        });
      }

      // Create expense
      const expense = await Expense.create({
        user: req.user._id,
        title,
        amount,
        category,
        paymentMethod,
        notes,
        expenseDate,
        isRecurring,
        recurringType,
      });

      // CREATE NOTIFICATION
      const notification = await Notification.create({
          user: req.user._id,
          title: "Expense Added",
          message: `₹${amount} added for ${category}`,
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
        message: "Expense created successfully",
        data: expense,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  // GET ALL EXPENSE
  async getAllExpenses(req, res) {
    try {
      const expenses = await Expense.find({
        user: req.user._id,
      }).sort({
        expenseDate: -1,
      });

      return res.status(200).json({
        success: true,
        count: expenses.length,
        data: expenses,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  //GET SINGLE EXPENSE
  async getSingleExpense(req, res) {
    try {
      const expense = await Expense.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!expense) {
        return res.status(404).json({
          success: false,
          message: "Expense not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: expense,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  //UPDATE EXPENSE
  async updateExpense(req, res) {
    try {
      let expense = await Expense.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!expense) {
        return res.status(404).json({
          success: false,
          message: "Expense not found",
        });
      }

      expense = await Expense.findByIdAndUpdate(
        req.params.id,

        req.body,

        {
          new: true,
          runValidators: true,
        },
      );

      return res.status(200).json({
        success: true,
        message: "Expense updated successfully",
        data: expense,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  //DELETE EXPENSE
  async deleteExpense(req, res) {
    try {
      const expense = await Expense.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!expense) {
        return res.status(404).json({
          success: false,
          message: "Expense not found",
        });
      }

      await expense.deleteOne();

      return res.status(200).json({
        success: true,
        message: "Expense deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  // MONTHLY EXPENSE ANALYTICS
  async monthlyExpenseAnalytics(req, res) {
    try {
      // Current date
      const currentDate = new Date();
      // First day of current month
      const firstDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
      );
      // Last day of current month
      const lastDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0,
        23,
        59,
        59,
      );

      // Aggregation
      const analytics = await Expense.aggregate([
        // Match logged-in user expenses
        {
          $match: {
            user: req.user._id,
            expenseDate: {
              $gte: firstDay,
              $lte: lastDay,
            },
          },
        },

        // Group data
        {
          $group: {
            _id: "$category",
            totalAmount: {
              $sum: "$amount",
            },
            transactionCount: {
              $sum: 1,
            },
          },
        },
      ]);

      // Total expense
      const totalExpense = analytics.reduce(
        (acc, item) => acc + item.totalAmount,
        0,
      );
      // Total transactions
      const totalTransactions = analytics.reduce(
        (acc, item) => acc + item.transactionCount,
        0,
      );

      // Category breakdown
      const categoryBreakdown = analytics.map((item) => ({
        category: item._id,
        total: item.totalAmount,
        transactions: item.transactionCount,
      }));

      return res.status(200).json({
        success: true,
        month: currentDate.toLocaleString("default", { month: "long" }),
        totalExpense,
        totalTransactions,
        categoryBreakdown,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  // LAST 6 MONTHS EXPENSE TREND
  async lastSixMonthsExpense(req, res) {
    try {
      // Current date
      const currentDate = new Date();

      // Date 6 months ago
      const sixMonthsAgo = new Date();

      sixMonthsAgo.setMonth(currentDate.getMonth() - 5);

      sixMonthsAgo.setDate(1);

      // Aggregation
      const expenses = await Expense.aggregate([
        // Match logged-in user expenses
        {
          $match: {
            user: req.user._id,

            expenseDate: {
              $gte: sixMonthsAgo,
              $lte: currentDate,
            },
          },
        },

        // Group by month and year
        {
          $group: {
            _id: {
              year: {
                $year: "$expenseDate",
              },

              month: {
                $month: "$expenseDate",
              },
            },

            totalExpense: {
              $sum: "$amount",
            },
          },
        },

        // Sort ascending
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]);

      // Month names
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      // Format response
      const formattedData = expenses.map((item) => ({
        month: monthNames[item._id.month - 1],

        year: item._id.year,

        totalExpense: item.totalExpense,
      }));

      return res.status(200).json({
        success: true,
        data: formattedData,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  // DASHBOARD SUMMARY API
  async dashboardSummary(req, res) {
    try {
      // Current date
      const currentDate = new Date();

      // Current month start
      const firstDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
      );

      // ===== TOTAL EXPENSE =====
      const totalExpenseData = await Expense.aggregate([
        {
          $match: {
            user: req.user._id,
          },
        },

        {
          $group: {
            _id: null,

            totalExpense: {
              $sum: "$amount",
            },

            totalTransactions: {
              $sum: 1,
            },
          },
        },
      ]);

      // ===== THIS MONTH EXPENSE =====
      const thisMonthData = await Expense.aggregate([
        {
          $match: {
            user: req.user._id,

            expenseDate: {
              $gte: firstDay,
              $lte: currentDate,
            },
          },
        },

        {
          $group: {
            _id: null,

            total: {
              $sum: "$amount",
            },
          },
        },
      ]);

      // ===== RECENT EXPENSES =====
      const recentExpenses = await Expense.find({
        user: req.user._id,
      })
        .sort({
          expenseDate: -1,
        })
        .limit(5);

      // ===== CATEGORY BREAKDOWN =====
      const categoryBreakdown = await Expense.aggregate([
        {
          $match: {
            user: req.user._id,
          },
        },

        {
          $group: {
            _id: "$category",

            totalAmount: {
              $sum: "$amount",
            },
          },
        },

        {
          $sort: {
            totalAmount: -1,
          },
        },
      ]);

      // ===== LAST 6 MONTHS =====
      const sixMonthsAgo = new Date();

      sixMonthsAgo.setMonth(currentDate.getMonth() - 5);

      sixMonthsAgo.setDate(1);

      const monthlyTrend = await Expense.aggregate([
        {
          $match: {
            user: req.user._id,

            expenseDate: {
              $gte: sixMonthsAgo,
              $lte: currentDate,
            },
          },
        },

        {
          $group: {
            _id: {
              year: {
                $year: "$expenseDate",
              },

              month: {
                $month: "$expenseDate",
              },
            },

            totalExpense: {
              $sum: "$amount",
            },
          },
        },

        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]);

      // Month names
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      // Format trend
      const formattedTrend = monthlyTrend.map((item) => ({
        month: monthNames[item._id.month - 1],

        year: item._id.year,

        totalExpense: item.totalExpense,
      }));

      // Final response
      return res.status(200).json({
        success: true,
        data: {
          totalExpense: totalExpenseData[0]?.totalExpense || 0,
          totalTransactions: totalExpenseData[0]?.totalTransactions || 0,
          thisMonthExpense: thisMonthData[0]?.total || 0,
          recentExpenses,
          categoryBreakdown: categoryBreakdown.map((item) => ({
            category: item._id,
            total: item.totalAmount,
          })),
          monthlyTrend: formattedTrend,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  
}

module.exports = new ExpenseController();
