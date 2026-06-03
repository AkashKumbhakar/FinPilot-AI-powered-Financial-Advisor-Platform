const Income =require("../models/Income");
const Expense =require("../models/Expense");
const Notification = require("../models/Notification")
const {sendNotification} = require("../../utils/socketService");

class IncomeController {
    // ADD INCOME
    async addIncome(req, res) {
        try {
            const {source, amount, category, paymentMethod, description, incomeDate} = req.body;
            // Validation
            if (!source || !amount) {
                return res.status(400).json({
                    success: false,
                    message: "Source and amount are required"
                });
            }
            // Create income
            const income = await Income.create({
                user: req.user._id,
                source,
                amount,
                category,
                paymentMethod,
                description,
                incomeDate
            });
            // CREATE NOTIFICATION
                  const notification = await Notification.create({
                      user: req.user._id,
                      title: "Income Added",
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
                message: "Income added successfully",
                data: income
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // GET ALL INCOME
    async getAllIncome(req, res) {
        try {
            const income = await Income.find({user: req.user._id}).sort({incomeDate: -1});
            return res.status(200).json({
                success: true,
                count: income.length,
                data: income
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // GET SINGLE INCOME
    async getSingleIncome(req, res) {
        try {
            const income = await Income.findOne({
                _id: req.params.id,
                user: req.user._id
            });
            if (!income) {
                return res.status(404).json({
                    success: false,
                    message: "Income not found"
                });
            }
            return res.status(200).json({
                success: true,
                data: income
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // UPDATE INCOME
    async updateIncome(req, res) {
        try {
            const income = await Income.findOne({
                _id: req.params.id,
                user: req.user._id
            });
            if (!income) {
                return res.status(404).json({
                    success: false,
                    message: "Income not found"
                });
            }
            const updatedIncome = await Income.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );
            
            return res.status(200).json({
                success: true,
                message: "Income updated successfully",
                data: updatedIncome
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // DELETE INCOME
    async deleteIncome(req, res) {

        try {
            const income = await Income.findOne({
                _id: req.params.id,
                user: req.user._id
            });

            if (!income) {
                return res.status(404).json({
                    success: false,
                    message: "Income not found"
                });
            }

            await income.deleteOne();
            return res.status(200).json({
                success: true,
                message: "Income deleted successfully"
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
     // INCOME VS EXPENSE ANALYTICS
 async incomeExpenseAnalytics(req, res) {
    try {
        // ===== TOTAL INCOME =====
        const incomeData = await Income.aggregate([
            {
                $match: {
                    user: req.user._id
                }
            },
            {
                $group: {
                    _id: null,
                    totalIncome: {
                        $sum: "$amount"
                    }
                }
            }
        ]);

        // ===== TOTAL EXPENSE =====
        const expenseData = await Expense.aggregate([
            {
                $match: {
                    user: req.user._id
                }
            },
            {
                $group: {
                    _id: null,
                    totalExpense: {
                        $sum: "$amount"
                    }
                }
            }
        ]);

        // Values
        const totalIncome = incomeData.length > 0 ? incomeData[0].totalIncome : 0;

        const totalExpense = expenseData.length > 0 ? expenseData[0].totalExpense : 0;

        // Savings
        const totalSavings = totalIncome - totalExpense;

        // Savings rate
        const savingsRate = totalIncome > 0
        ? ((totalSavings / totalIncome)* 100).toFixed(2) : 0;

        // Financial health
        let financialHealth = "";

        if (savingsRate >= 50) {
            financialHealth ="Excellent";

        } else if (savingsRate >= 30) {
            financialHealth ="Good";
        } else if (savingsRate >= 10) {
            financialHealth ="Average";
        } else {
            financialHealth ="Poor";
        }
        return res.status(200).json({
            success: true,
            totalIncome,
            totalExpense,
            totalSavings,
            savingsRate: `${savingsRate}%`,
            financialHealth
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
}

module.exports = new IncomeController();