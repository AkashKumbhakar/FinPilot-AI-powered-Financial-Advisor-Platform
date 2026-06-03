const User =  require("../models/User");
const Expense =  require("../models/Expense");
const Income =  require("../models/Income");

class AdminController {

  // =========================
  // DASHBOARD STATS
  // =========================

  async dashboard(req, res) {

    try {

      // TOTAL USERS
      const totalUsers =
        await User.countDocuments({
          role: "user",
        });

      // VERIFIED USERS
      const verifiedUsers =
        await User.countDocuments({
          is_verified: true,
          role: "user",
        });

      // BLOCKED USERS
      const blockedUsers =
        await User.countDocuments({
          isBlocked: true,
          role: "user",
        });

      // PREMIUM USERS
      const premiumUsers =
        await User.countDocuments({
          "subscription.plan":
            "premium",
          role: "user",
        });

      // TRIAL USERS
      const trialUsers =
        await User.countDocuments({
          "subscription.plan":
            "trial",
          role: "user",
        });

      // ACTIVE SUBSCRIPTIONS
      const activeSubscriptions =
        await User.countDocuments({
          "subscription.status":
            "active",
          "subscription.plan":
            "premium",
          role: "user",
        });

      // REVENUE
      const monthlyRevenue =
        premiumUsers * 299;

      const yearlyRevenue =
        monthlyRevenue * 12;
      // RECENT USERS
      const recentUsers =
        await User.find({
          role: "user",
        })
          .select(
            "name email subscription.plan createdAt"
          )
          .sort({
            createdAt: -1,
          })
          .limit(5);

      return res.status(200).json({
        success: true,

        data: {

          // USERS
          totalUsers,
          verifiedUsers,
          blockedUsers,

          // SUBSCRIPTIONS
          premiumUsers,
          trialUsers,
          activeSubscriptions,
          premiumPlanPrice:299,
          monthlyRevenue,
          yearlyRevenue,
          // RECENT USERS
          recentUsers,
        },
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  }

  // =========================
  // GET USERS
  // =========================

  async getUsers(req, res) {

    try {

      const users =
        await User.find({
          role: "user",
        })
          .select(
            "-password -refreshToken"
          )
          .sort({
            createdAt: -1,
          });

      return res.status(200).json({
        success: true,
        count: users.length,
        users,
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  }

  // =========================
  // BLOCK / UNBLOCK USER
  // =========================

  async blockUser(req, res) {

    try {

      const user =
        await User.findById(
          req.params.id
        );

      if (!user) {

        return res.status(404).json({
          success: false,
          message: "User not found",
        });

      }

      // PREVENT ADMIN BLOCK
      if (user.role === "admin") {

        return res.status(403).json({
          success: false,
          message:
            "Admin account cannot be blocked",
        });

      }

      user.isBlocked =
        !user.isBlocked;

      await user.save();

      return res.status(200).json({
        success: true,

        message:
          user.isBlocked
            ? "User blocked successfully"
            : "User unblocked successfully",

        isBlocked:
          user.isBlocked,
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  }

  // =========================
  // DELETE USER
  // =========================

  async deleteUser(req, res) {

    try {

      const user =
        await User.findById(
          req.params.id
        );

      if (!user) {

        return res.status(404).json({
          success: false,
          message: "User not found",
        });

      }

      // PREVENT ADMIN DELETE
      if (user.role === "admin") {

        return res.status(403).json({
          success: false,
          message:
            "Admin account cannot be deleted",
        });

      }

      await User.findByIdAndDelete(
        req.params.id
      );

      return res.status(200).json({
        success: true,
        message:
          "User deleted successfully",
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  }

  // =========================
  // SUBSCRIPTIONS
  // =========================

  async subscriptions(
    req,
    res
  ) {

    try {

      const users =
        await User.find({
          "subscription.plan":
            "premium",
          role: "user",
        })
          .select(
            `
            name
            email
            is_verified
            subscription
            createdAt
          `
          )
          .sort({
            createdAt: -1,
          });

      const totalPremiumUsers =
        users.length;

      const totalRevenue =
        totalPremiumUsers * 299;

      return res.status(200).json({
        success: true,

        totalPremiumUsers,

        totalRevenue,

        users,
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  }

  // =========================
  // REVENUE
  // =========================

  async revenue(req, res) {

    try {

      // PREMIUM USERS
      const premiumUsers =
        await User.countDocuments({
          "subscription.plan":
            "premium",
          role: "user",
        });

      // MONTHLY REVENUE
      const monthlyRevenue =
        premiumUsers * 299;

      // YEARLY REVENUE
      const yearlyRevenue =
        monthlyRevenue * 12;

      return res.status(200).json({
        success: true,

        data: {

          premiumUsers,

          monthlyRevenue,

          yearlyRevenue,

          premiumPlanPrice:
            299,
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

module.exports = new AdminController();