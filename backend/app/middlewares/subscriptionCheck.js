const subscriptionCheck = async (req, res, next) => {

    const user = req.user;
    const now = new Date();

    // FREE TRIAL
    if (
        user.subscription.plan === "trial" && user.subscription.trialEndsAt > now) {
        return next();
    }

    // PAID PLAN
    if ((user.subscription.plan === "premium") && user.subscription.subscriptionEndsAt > now
    ) {
        return next();
    }

    // EXPIRED
    return res.status(403).json({
        success: false,
        message: "Your free trial has expired. Please upgrade your plan.",
    });
};

module.exports = subscriptionCheck;