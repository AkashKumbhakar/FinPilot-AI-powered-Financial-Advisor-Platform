const mongoose =
require("mongoose");

const incomeSchema =
new mongoose.Schema({

    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    source: {
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
        enum: [
            "Salary",
            "Freelancing",
            "Business",
            "Investment",
            "Rental",
            "Passive Income",
            "Other"
        ],

        default: "Other"
    },

    paymentMethod: {
        type: String,
        enum: [
            "Cash",
            "UPI",
            "Card",
            "Bank Transfer",
            "Cheque",
            "Other"
        ],

        default: "Bank Transfer"
    },

    description: {
        type: String,
        trim: true
    },

    incomeDate: {
        type: Date,
        default: Date.now
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Income",incomeSchema);