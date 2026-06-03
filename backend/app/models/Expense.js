const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    title: {
        type: String,
        required: true,
        trim: true
    },

    amount: {
        type: Number,
        required: true,
        min: 0
    },

    category: {
        type: String,
        required: true,
        enum: [
            "Food",
            "Rent",
            "Transport",
            "Shopping",
            "Entertainment",
            "Bills",
            "Healthcare",
            "Education",
            "Travel",
            "Investment",
            "Other"
        ]
    },

    paymentMethod: {
        type: String,
        enum: [
            "Cash",
            "UPI",
            "Credit Card",
            "Debit Card",
            "Net Banking",
            "Bank Transfer",
            "Wallet"
        ],
        default: "UPI"
    },

    notes: {
        type: String,
        trim: true,
        maxlength: 500
    },

    expenseDate: {
        type: Date,
        default: Date.now
    },

    isRecurring: {
        type: Boolean,
        default: false
    },

    recurringType: {
        type: String,
        enum: [
            "Daily",
            "Weekly",
            "Monthly",
            "Yearly"
        ],
        default: null
    }

}, {
    timestamps: true
});


// Index for faster user expense queries
expenseSchema.index({
    user: 1,
    expenseDate: -1
});


module.exports = mongoose.model("Expense",expenseSchema);