"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
  CreditCard,
  CheckCircle2,
  Sparkles,
  Crown,
  ShieldCheck,
  Calendar,
  Loader2,
  Brain,
  BadgeCheck,
  Clock3,
  Receipt,
  Wallet,
  Star,
} from "lucide-react";
import { toast } from "react-toastify";

interface SubscriptionData {
  plan: string;
  status: string;
  trialEndsAt?: string;
  subscriptionEndsAt?: string;
}

export default function BillingPage() {
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [daysLeft, setDaysLeft] = useState<number>(0);

  // FETCH SUBSCRIPTION
  const fetchSubscription = async () => {
    try {
      const res = await api.get("/user/profile");
      const sub = res.data.data.subscription;
      setSubscription(sub);

      // TRIAL REMAINING DAYS
      if (sub?.trialEndsAt) {
        const remaining = Math.ceil(
          (new Date(sub.trialEndsAt).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        );
        setDaysLeft(remaining > 0 ? remaining : 0);
      }
    } catch (error) {
      console.error("Error fetching subscription data:", error);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  // SUBSCRIBE
  const handleSubscribe = async () => {
    try {
      setLoading(true);
      const res = await api.post("/subscription/create-checkout-session");
      window.location.href = res.data.url;
    } catch (error: any) {
      console.error("Stripe subscription checkout failure:", error);
      toast.error(
        error.response?.data?.message || "Failed to start payment process"
      );
    } finally {
      setLoading(false);
    }
  };

  const isPremium = subscription?.plan === "premium" && subscription?.status === "active";

  const subscriptionEndDate = subscription?.subscriptionEndsAt
    ? new Date(subscription.subscriptionEndsAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const trialEndDate = subscription?.trialEndsAt
    ? new Date(subscription.trialEndsAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="space-y-6 text-[#E2E8F0] font-sans">
      
      {/* HERO SECTION */}
      <div
        className="
        relative overflow-hidden
        rounded-2xl
        border border-emerald-500/10
        bg-gradient-to-br
        from-emerald-500/5
        via-teal-500/5
        to-[#050f09]
        p-8 md:p-10
        shadow-md
        "
      >
        <div
          className="
          absolute top-0 right-0
          h-72 w-72
          bg-emerald-500/5
          blur-3xl
          rounded-full
          pointer-events-none
          "
        />

        <div className="relative z-10">
          <div
            className="
            inline-flex items-center gap-2
            bg-emerald-500/10
            border border-emerald-500/20
            text-emerald-400
            px-4 py-2
            rounded-full
            text-xs font-bold uppercase tracking-wider
            mb-6
            "
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            FinPilot AI Premium
          </div>

          <h1
            className="
            text-3xl md:text-4xl
            font-extrabold text-white leading-tight
            "
          >
            Unlock Premium <br />
            Financial Intelligence
          </h1>

          <p
            className="
            text-slate-400
            mt-4
            max-w-2xl
            text-sm
            leading-relaxed
            "
          >
            Access AI-powered financial insights, predictive analytics, intelligent
            savings strategies, premium reports, and advanced money management tools.
          </p>

          {/* SUBSCRIPTION STATUS */}
          <div className="mt-8 grid lg:grid-cols-3 gap-5">
            
            {/* CURRENT PLAN */}
            <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-xl p-5 backdrop-blur-md shadow-sm relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-emerald-400" />
                </div>

                {isPremium ? (
                  <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-wider">
                    ACTIVE
                  </div>
                ) : (
                  <div className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[10px] font-bold tracking-wider">
                    TRIAL
                  </div>
                )}
              </div>

              <div className="mt-5">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  Current Plan
                </p>
                <h3 className="text-2xl font-extrabold text-white mt-1">
                  {isPremium ? "Premium" : "Free Trial"}
                </h3>
              </div>
            </div>

            {/* PLAN VALIDITY */}
            <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-xl p-5 backdrop-blur-md shadow-sm relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300">
              <div className="h-12 w-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-teal-400" />
              </div>

              <div className="mt-5">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  {isPremium ? "Plan Expiry Date" : "Trial Ends On"}
                </p>
                <h3 className="text-lg font-bold text-white mt-1.5 leading-snug">
                  {isPremium ? subscriptionEndDate : trialEndDate}
                </h3>
              </div>
            </div>

            {/* DAYS LEFT */}
            <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-xl p-5 backdrop-blur-md shadow-sm relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Clock3 className="w-6 h-6 text-emerald-400" />
              </div>

              <div className="mt-5">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  {isPremium ? "Days Remaining" : "Trial Remaining"}
                </p>
                <h3 className="text-3xl font-black text-white mt-1">
                  {isPremium && subscription?.subscriptionEndsAt
                    ? Math.max(
                        0,
                        Math.ceil(
                          (new Date(subscription.subscriptionEndsAt).getTime() -
                            new Date().getTime()) /
                            (1000 * 60 * 60 * 24)
                        )
                      )
                    : daysLeft}
                  <span className="text-sm text-slate-500 ml-1 font-semibold">days</span>
                </h3>
              </div>
            </div>
          </div>

          {/* TRIAL BANNER */}
          {!isPremium && subscription?.plan === "trial" && (
            <div className="mt-6 inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-xl text-yellow-400 text-xs font-semibold">
              <Calendar className="w-4 h-4" />
              {daysLeft} days remaining in your free trial
            </div>
          )}

          {/* ACTIVE BANNER */}
          {isPremium && (
            <div className="mt-6 inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl text-emerald-400 text-xs font-semibold">
              <BadgeCheck className="w-4 h-4" />
              Premium Subscription Active
            </div>
          )}
        </div>
      </div>

      {/* PRICING CARD */}
      <div
        className="
        max-w-3xl mx-auto
        rounded-2xl
        border border-emerald-500/20
        bg-gradient-to-br
        from-[#050f09]
        to-[#030d07]
        p-8 md:p-10
        relative overflow-hidden
        shadow-xl shadow-emerald-950/30
        "
      >
        <div
          className="
          absolute top-0 right-0
          h-60 w-60
          bg-emerald-500/5
          rounded-full blur-3xl
          pointer-events-none
          "
        />

        <div className="relative z-10">
          <div
            className="
            h-16 w-16
            rounded-xl
            bg-emerald-500/10
            border border-emerald-500/20
            flex items-center justify-center
            mb-6
            "
          >
            <Crown className="w-8 h-8 text-emerald-400" />
          </div>

          <h2 className="text-3xl font-extrabold text-white">
            Premium Plan
          </h2>

          <p className="text-slate-300 mt-2 text-sm max-w-xl">
            Everything you need to manage your personal finances with AI-powered
            intelligence.
          </p>

          {/* PRICE */}
          <div className="mt-8 flex items-end gap-2">
            <span className="text-6xl font-black text-white leading-none">
              ₹299
            </span>
            <span className="text-slate-400 mb-1 text-sm font-semibold">
              / month
            </span>
          </div>

          {/* FEATURES */}
          <div className="mt-10 grid md:grid-cols-2 gap-5">
            {[
              "Unlimited income & expense tracking",
              "AI Financial Advisor",
              "Monthly financial predictions",
              "Smart savings insights",
              "Advanced analytics dashboard",
              "Goal management system",
              "Premium reports",
              "Priority support",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-slate-200 text-sm">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSubscribe}
            disabled={loading || isPremium}
            className={`
              w-full mt-10
              rounded-xl
              py-4
              font-bold text-sm
              flex items-center justify-center gap-2
              transition-all duration-300
              ${
                isPremium
                  ? "bg-emerald-500/25 border border-emerald-500/20 text-emerald-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black hover:-translate-y-0.5 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25"
              }
            `}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isPremium ? (
              <>
                <BadgeCheck className="w-5 h-5" />
                Active Subscription
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Upgrade to Premium
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* BILLING INFO */}
      {isPremium && (
        <div
          className="
          rounded-2xl
          border border-emerald-500/10
          bg-[#050f09]/60
          p-8
          shadow-sm
          "
        >
          <div className="flex items-center justify-between flex-wrap gap-5">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Billing Information
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Your premium subscription is currently active.
              </p>
            </div>

            <div
              className="
              px-4 py-2
              rounded-xl
              bg-emerald-500/10
              border border-emerald-500/20
              text-emerald-400
              font-bold text-xs
              flex items-center gap-2
              uppercase tracking-wider
              "
            >
              <BadgeCheck className="w-4 h-4" />
              Payment Verified
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            
            {/* PLAN */}
            <div className="bg-[#07130c]/40 border border-emerald-500/5 rounded-xl p-6 relative overflow-hidden group hover:border-emerald-500/10 transition">
              <Wallet className="w-8 h-8 text-emerald-400 mb-4" />
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                Subscription
              </p>
              <h3 className="text-xl font-bold text-white mt-1">
                Premium
              </h3>
            </div>

            {/* PRICE */}
            <div className="bg-[#07130c]/40 border border-emerald-500/5 rounded-xl p-6 relative overflow-hidden group hover:border-emerald-500/10 transition">
              <Receipt className="w-8 h-8 text-teal-400 mb-4" />
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                Monthly Billing
              </p>
              <h3 className="text-xl font-bold text-white mt-1">
                ₹299/month
              </h3>
            </div>

            {/* STATUS */}
            <div className="bg-[#07130c]/40 border border-emerald-500/5 rounded-xl p-6 relative overflow-hidden group hover:border-emerald-500/10 transition">
              <Star className="w-8 h-8 text-emerald-400 mb-4" />
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                Account Status
              </p>
              <h3 className="text-xl font-bold text-emerald-400 mt-1">
                Active
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* BENEFITS */}
      <div
        className="
        rounded-2xl
        border border-emerald-500/10
        bg-[#050f09]/60
        p-8
        shadow-sm
        "
      >
        <h2 className="text-2xl font-bold text-white mb-8">
          Premium Benefits
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          
          {/* AI ADVISOR */}
          <div className="bg-[#07130c]/40 border border-emerald-500/5 rounded-xl p-6 relative overflow-hidden group hover:border-emerald-500/10 transition duration-300">
            <Brain className="w-10 h-10 text-emerald-400 mb-5" />
            <h3 className="text-lg font-bold text-white">
              AI Financial Advisor
            </h3>
            <p className="text-slate-400 mt-3 text-xs leading-relaxed">
              Receive personalized AI-generated financial insights based on your spending
              habits.
            </p>
          </div>

          {/* SMART PREDICTIONS */}
          <div className="bg-[#07130c]/40 border border-emerald-500/5 rounded-xl p-6 relative overflow-hidden group hover:border-emerald-500/10 transition duration-300">
            <Sparkles className="w-10 h-10 text-teal-400 mb-5" />
            <h3 className="text-lg font-bold text-white">
              Smart Predictions
            </h3>
            <p className="text-slate-400 mt-3 text-xs leading-relaxed">
              Predict future savings, expenses, and financial trends using AI analytics.
            </p>
          </div>

          {/* PREMIUM SECURITY */}
          <div className="bg-[#07130c]/40 border border-emerald-500/5 rounded-xl p-6 relative overflow-hidden group hover:border-emerald-500/10 transition duration-300">
            <ShieldCheck className="w-10 h-10 text-emerald-400 mb-5" />
            <h3 className="text-lg font-bold text-white">
              Premium Security
            </h3>
            <p className="text-slate-400 mt-3 text-xs leading-relaxed">
              Enterprise-grade encrypted financial data protection for complete security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
