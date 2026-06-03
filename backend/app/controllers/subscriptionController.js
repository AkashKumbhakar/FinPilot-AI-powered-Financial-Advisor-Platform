const stripe = require("../config/stripe");
const User = require("../models/User");
const Notification = require("../models/Notification")
const {sendNotification} = require("../../utils/socketService");

class SubscriptionController {

  // CREATE CHECKOUT SESSION
  async createCheckoutSession(req,res) {
    try {
      const user = req.user;
      const session = await stripe.checkout.sessions.create(
          {
            payment_method_types: [
              "card",
            ],
            mode: "subscription",
            customer_email: user.email,
            line_items: [
              {
                price_data: {
                  currency: "inr",
                  product_data: {
                    name: "FinPilot AI Premium",
                  },
                  recurring: {
                    interval: "month",
                  },
                  unit_amount: 29900, // ₹299
                },
                quantity: 1,
              },
            ],

            success_url: `${process.env.CLIENT_URL}/dashboard/billing/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/dashboard/billing/cancel`,
            metadata: {
              userId: user._id.toString(),
            },
          }
        );

      return res.status(200).json({
        success: true,
        url: session.url,
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // VERIFY SUBSCRIPTION

  async verifySubscription(req,res) {
    try {
      const { sessionId } = req.body;

      // GET SESSION
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      // PAYMENT FAILED
      if (session.payment_status !== "paid") {
        return res.status(400).json({
          success: false,
          message: "Payment not completed",
        });
      }

      // FIND USER
      const userId = session.metadata.userId;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // NEXT MONTH DATE

      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      // ACTIVATE PREMIUM

      user.subscription = {
        plan: "premium",
        status: "active",
        trialEndsAt: null,
        subscriptionEndsAt: nextMonth,
      };

      await user.save();
      // CREATE NOTIFICATION
            const notification = await Notification.create({
                user: req.user._id,
                title: "Subscription Added",
                message: "Premium subscription activated successfully",
                isRead: false,
                });
      
            // SOCKET NOTIFICATION
            const socketId = req.app.locals.onlineUsers.get(
              req.user._id.toString()
            );
      
            if (socketId) {
              sendNotification(socketId, notification);
          }
      return res.status(200).json({
        success: true,
        message: "Premium subscription activated successfully",
        subscription: user.subscription,
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new SubscriptionController();