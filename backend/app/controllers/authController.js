const sendEmail = require("../../utils/sendMail");
const User = require("../models/User");
const OTPModel = require("../models/OTPModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { generateAccessToken, generateRefreshToken} = require("../../utils/generateToken");
const { verifyEmailTemplate, resetPasswordEmailTemplate} = require("../../utils/emailTemplates");

class AuthController {
  // Register
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      // Validate fields
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      // Check existing user
      const existUser = await User.findOne({ email: email.toLowerCase() });

      if (existUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      // Create user
      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
      });

      // Delete previous OTPs
      await OTPModel.deleteMany({
        userId: user._id,
      });

      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Save OTP
      await OTPModel.create({
        userId: user._id,
        otp,
      });

      // Send Email
      await sendEmail(
          user.email,
          "Verify Your Account",
          verifyEmailTemplate(user, otp)
      );
      // Remove password from response
      user.password = undefined;

      return res.status(201).json({
        success: true,
        message: "User registered successfully. OTP sent to your email.",
        data: user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  //VERIFY-OTP
  async verifyOTP(req, res) {
    try {
      const { email, otp } = req.body;
      // Validate fields
      if (!email || !otp) {
        return res.status(400).json({
          success: false,
          message: "Email and OTP are required",
        });
      }

      // Find user
      const existingUser = await User.findOne({ email: email.toLowerCase() });

      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Check if already verified
      if (existingUser.is_verified) {
        return res.status(400).json({
          success: false,
          message: "User already verified",
        });
      }

      // Find OTP
      const emailVerification = await OTPModel.findOne({
        userId: existingUser._id,
      }).sort({ createdAt: -1 });

      // Invalid OTP
      if (!emailVerification || emailVerification.otp !== String(otp).trim()) {
        return res.status(400).json({
          success: false,
          message: "Invalid OTP",
        });
      }

      // Check OTP expiry (5 minutes)
      const currentTime = new Date();

      const expirationTime = new Date(
        emailVerification.createdAt.getTime() + 5 * 60 * 1000,
      );

      // OTP expired
      if (currentTime > expirationTime) {
        // Delete expired OTP
        await OTPModel.deleteMany({
          userId: existingUser._id,
        });

        return res.status(400).json({
          success: false,
          message: "OTP expired",
        });
      }

      // Mark user verified
      existingUser.is_verified = true;

      await existingUser.save();

      // Delete OTP after verification
      await OTPModel.deleteMany({
        userId: existingUser._id,
      });

      return res.status(200).json({
        success: true,
        message: "Email verified successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  // RESEND OTP
  async resendOTP(req, res) {
    try {
      const { email } = req.body;

      // VALIDATE EMAIL
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      // FIND USER
      const user = await User.findOne({
        email: email.toLowerCase(),
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // CHECK VERIFIED
      if (user.is_verified) {
        return res.status(400).json({
          success: false,
          message: "User already verified",
        });
      }

      // CHECK LAST OTP
      const lastOTP = await OTPModel.findOne({
        userId: user._id,
      }).sort({ createdAt: -1 });

      // 60 SECOND TIMER
      if (lastOTP) {
        const diff =
          (Date.now() - new Date(lastOTP.createdAt).getTime()) / 1000;

        if (diff < 60) {
          return res.status(400).json({
            success: false,
            message: `Please wait ${Math.ceil(
              60 - diff,
            )} seconds before requesting a new OTP`,
          });
        }
      }

      // GENERATE OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // SAVE OTP
      await OTPModel.create({
        userId: user._id,
        otp,
      });

      // SEND EMAIL
      await sendEmail(
          user.email,
          "Verify Your Account",
          verifyEmailTemplate(user, otp)
      );

      return res.status(200).json({
        success: true,
        message: "OTP resent successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  // LOGIN
  async login(req, res) {
    try {
      const { email, password } = req.body;
      // VALIDATE
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }
      // FIND USER
      const user = await User.findOne({
        email: email.toLowerCase(),
      });
      // USER NOT FOUND
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid credentials",
        });
      }
      // BLOCKED USER
      if (user.isBlocked) {
        return res.status(403).json({
          success: false,
          type: "BLOCKED",
          message: "Your account has been blocked by admin",
        });
      }

      // PASSWORD CHECK
      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Invalid credentials",
        });
      }
      // EMAIL NOT VERIFIED
      if (!user.is_verified) {
        // GENERATE OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        // DELETE OLD OTP
        await OTPModel.deleteMany({
          userId: user._id,
        });
        // SAVE NEW OTP
        await OTPModel.create({
          userId: user._id,
          otp,
        });

        // SEND EMAIL
        await sendEmail(
          user.email,
          "Verify Your Account",
          verifyEmailTemplate(user, otp)
      );

        return res.status(403).json({
          success: false,
          type: "UNVERIFIED",
          message: "Email not verified. OTP sent to your email.",
        });
      }

      // TOKENS
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      // SAVE REFRESH TOKEN
      user.refreshToken = refreshToken;
      await user.save();

      // COOKIE
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // REMOVE SENSITIVE DATA
      user.password = undefined;
      user.refreshToken = undefined;

      return res.status(200).json({
        success: true,
        message: "Login successful",
        accessToken,
        user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  //refreshAccessToken
  async refreshAccessToken(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: "Refresh token missing",
        });
      }

      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      const accessToken = generateAccessToken(decoded.id);

      return res.status(200).json({
        success: true,
        accessToken,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  //forgot password
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      // Validate email
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }
      // Find user
      const user = await User.findOne({
        email: email.toLowerCase(),
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      // Generate reset token
      const resetToken = crypto.randomBytes(20).toString("hex");

      // Hash token and save in DB
      user.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      // Token expiry (15 minutes)
      user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

      // Save user
      await user.save({ validateBeforeSave: false });

      // Reset URL
      const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

      // SEND EMAIL
      await sendEmail(
        user.email,
        "Password Reset",
        resetPasswordEmailTemplate(user, resetUrl),
      );

      return res.status(200).json({
        success: true,
        message: "Password reset email sent",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  // Reset Password
  async resetPassword(req, res) {
    try {
      const { password, confirm_password } = req.body;
      // Validate fields
      if (!password || !confirm_password) {
        return res.status(400).json({
          success: false,
          message: "Password and confirm password are required",
        });
      }
      // Match passwords
      if (password !== confirm_password) {
        return res.status(400).json({
          success: false,
          message: "Passwords do not match",
        });
      }

      // Hash token from params
      const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

      // Find user with valid token
      const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {
          $gt: Date.now(),
        },
      });

      // Invalid or expired token
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired reset token",
        });
      }

      // Update password
      user.password = password;
      // Clear reset fields
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      // Save user
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Password reset successful",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  // Logout
  async logout(req, res) {
    res.clearCookie("refreshToken");

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  }
}
module.exports = new AuthController();
