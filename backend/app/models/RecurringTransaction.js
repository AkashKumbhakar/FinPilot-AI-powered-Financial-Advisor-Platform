const mongoose = require("mongoose");

const recurringTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["Income", "Expense"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      enum: [
        "Salary",
        "Food",
        "Bills",
        "Travel",
        "Shopping",
        "Entertainment",
        "Investment",
        "Health",
        "Other",
      ],
      required: true,
    },
    frequency: {
      type: String,
      enum: ["Daily", "Weekly", "Monthly", "Yearly"],
      default: "Monthly",
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "UPI", "Card", "Bank Transfer", "Cheque", "Other"],
      default: "UPI",
    },
    startDate: {
      type: Date,
      required: true,
    },
    nextExecutionDate: {
      type: Date,
      required: true,
    },
    lastExecutionDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model(
  "RecurringTransaction",
  recurringTransactionSchema,
);
