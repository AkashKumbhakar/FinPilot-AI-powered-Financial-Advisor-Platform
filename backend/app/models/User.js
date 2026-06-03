const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    subscription: {
    plan: {
        type: String,
        enum: ["trial", "premium"],
        default: "trial"
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    trialEndsAt: {
        type: Date,
        default: () => {
            const date = new Date();
            date.setDate(date.getDate() + 14);
            return date;
        }
    },
    subscriptionEndsAt: {
        type: Date
    }},
    isBlocked: {
        type: Boolean,
        default: false,
    },
    refreshToken:{
        type:String
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
    
}, {
    timestamps: true
});


// Hash Password
userSchema.pre("save", async function () {

    if (!this.isModified("password")) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 10);
});


// Compare Password
userSchema.methods.comparePassword = async function(password){

    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);