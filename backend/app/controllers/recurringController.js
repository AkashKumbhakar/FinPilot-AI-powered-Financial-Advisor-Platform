const RecurringTransaction = require("../models/RecurringTransaction");
const Expense = require("../models/Expense");
const Income = require("../models/Income");
const Notification = require("../models/Notification")
const {sendNotification} = require("../../utils/socketService");

class RecurringController {
  // CREATE RECURRING TRANSACTION
  async createRecurring(req, res) {
    try {
      const {
        title,
        type,
        amount,
        category,
        frequency,
        paymentMethod,
        startDate,
        notes,
      } = req.body;
      // Validation
      if (!title || !type || !amount || !category || !startDate) {
        return res.status(400).json({
          success: false,
          message: "Required fields missing",
        });
      }
      // Create recurring transaction
      const recurring = await RecurringTransaction.create({
        user: req.user._id,
        title,
        type,
        amount,
        category,
        frequency,
        paymentMethod,
        startDate,
        nextExecutionDate: startDate,
        notes,
      });
      // CREATE NOTIFICATION
            const notification = await Notification.create({
                user: req.user._id,
                title: "Recurring Added",
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
        message: "Recurring transaction created",
        data: recurring,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // GET ALL RECURRING TRANSACTIONS
  async getAllRecurring(req, res) {
    try {
      const recurring = await RecurringTransaction.find({
        user: req.user._id,
      }).sort({
        createdAt: -1,
      });

      return res.status(200).json({
        success: true,
        count: recurring.length,
        data: recurring,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // DELETE RECURRING TRANSACTION
  async deleteRecurring(req, res) {
    try {
      const recurring = await RecurringTransaction.findOne({
        _id: req.params.id,
        user: req.user._id,
      });
      if (!recurring) {
        return res.status(404).json({
          success: false,
          message: "Recurring transaction not found",
        });
      }
      await recurring.deleteOne();
      return res.status(200).json({
        success: true,
        message: "Recurring transaction deleted",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  // EXECUTE RECURRING TRANSACTIONS
  async executeRecurringTransactions(req, res) {
  try {
    const today = new Date();
    // FIND DUE TRANSACTIONS

    const recurringTransactions = await RecurringTransaction.find({
        isActive: true,
        nextExecutionDate: {
          $lte: today,
        },
      });

    let executedCount = 0;

    for (const recurring of recurringTransactions) {

      try {
        // CREATE EXPENSE

        if (recurring.type === "Expense") {
          await Expense.create({
            user: recurring.user,
            title: recurring.title,
            amount: recurring.amount,
            category: recurring.category,
            paymentMethod: recurring.paymentMethod,
            description: "Auto-generated recurring expense",
            expenseDate: today,
          });
        }
        // CREATE INCOME
    
        if (recurring.type === "Income") {
          await Income.create({
            user: recurring.user,
            source: recurring.title,
            amount: recurring.amount,
            category: recurring.category,
            paymentMethod: recurring.paymentMethod,
            description: "Auto-generated recurring income",
            incomeDate: today,
          });
        }

        // CREATE NOTIFICATION

        await Notification.create({
          user: recurring.user,
          title: "Recurring Transaction Executed",
          message: `${recurring.title} executed successfully.`,
          type: "Recurring",
        });

        // SOCKET.IO NOTIFICATION     

        const socketId =
          global.onlineUsers?.get(
            recurring.user.toString()
          );

        if (socketId && global.io) {
          global.io
            .to(socketId)
            .emit("newNotification", notification);
        }

        // CALCULATE NEXT DATE
    
        let nextDate =
          new Date(
            recurring.nextExecutionDate
          );

        switch (recurring.frequency) {
          case "Daily":

            nextDate.setDate(nextDate.getDate() + 1);
            break;

          case "Weekly":

            nextDate.setDate(nextDate.getDate() + 7);
            break;

          case "Monthly":

            nextDate.setMonth(nextDate.getMonth() + 1);
            break;

          case "Yearly":

            nextDate.setFullYear(nextDate.getFullYear() + 1);
            break;

          default:

            nextDate.setMonth(nextDate.getMonth() + 1);
        }

        // UPDATE RECURRING
       
        recurring.lastExecutionDate = today;
        recurring.nextExecutionDate = nextDate;
        await recurring.save();
        executedCount++;

      } catch (transactionError) {

        console.log(
          "Recurring execution failed:",
          transactionError.message
        );

        // CONTINUE OTHER TRANSACTIONS
        continue;
      }
    }

    return res.status(200).json({
      success: true,
      message: "Recurring transactions executed successfully",
      executedCount,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
  //GET ENUMS FOR FRONTEND
  async getRecurringEnums(req,res){
     try {

        const schema = RecurringTransaction.schema;

        res.status(200).json({
            success: true,
            data: {
                types: schema.path("type").enumValues,
                categories: schema.path("category").enumValues,
                frequencies: schema.path("frequency").enumValues,
                paymentMethods: schema.path("paymentMethod").enumValues,
            },
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
  }
}

module.exports = new RecurringController();
