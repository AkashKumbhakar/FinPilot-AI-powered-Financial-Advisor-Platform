"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { motion } from "framer-motion";
import {
  BrainCircuit,
  IndianRupee,
  Crown,
  TrendingUp,
  Wallet,
  Loader2,
  ArrowUpRight,
  BadgeIndianRupee,
} from "lucide-react";

export default function RevenuePage() {

  const [loading, setLoading] =
    useState(true);

  const [revenue, setRevenue] =
    useState(0);

  const [premiumUsers, setPremiumUsers] =
    useState(0);
    const [yearlyRevenue, setYearlyRevenue] =
  useState(0);

const [
  premiumPlanPrice,
  setPremiumPlanPrice
] = useState(299);

  // FETCH REVENUE
  const fetchRevenue = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res = await api.get(
        "/admin/revenue",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRevenue(
  res.data.data.monthlyRevenue || 0
);

setPremiumUsers(
  res.data.data.premiumUsers || 0
);

setYearlyRevenue(
  res.data.data.yearlyRevenue || 0
);

setPremiumPlanPrice(
  res.data.data.premiumPlanPrice || 299
);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

  return (
    <main className="min-h-screen bg-[#030805] text-[#E2E8F0] p-6 md:p-10 overflow-hidden relative">

      {/* GLOW */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          <div className="space-y-3">

            <div className="flex items-center gap-3">

              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <BrainCircuit className="w-6 h-6 text-black" />
              </div>

              <div>
                <h1 className="text-3xl font-black text-white">
                  Revenue Analytics
                </h1>

                <p className="text-slate-400 text-sm mt-1">
                  Monitor platform revenue,
                  subscriptions and growth.
                </p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (

          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-400" />
          </div>

        ) : (

          <>
            {/* TOP CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* TOTAL REVENUE */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="bg-[#07110c] border border-emerald-500/10 rounded-3xl p-7 relative overflow-hidden"
              >

                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 blur-3xl rounded-full" />

                <div className="relative">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-slate-400 text-sm">
                        Monthly Revenue
                      </p>

                      <h2 className="text-4xl font-black text-white mt-3 flex items-center gap-1">
                        <IndianRupee className="w-8 h-8 text-emerald-400" />
                        ₹{Number(revenue).toLocaleString()}
                      </h2>
                    </div>

                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <Wallet className="w-8 h-8 text-emerald-400" />
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-xs text-emerald-400 font-bold">
                    <ArrowUpRight className="w-4 h-4" />
                    +18.4% Growth this month
                  </div>
                </div>
              </motion.div>
                
              {/* PREMIUM USERS */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.1,
                }}
                className="bg-[#07110c] border border-emerald-500/10 rounded-3xl p-7"
              >

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-slate-400 text-sm">
                      Premium Users
                    </p>

                    <h2 className="text-4xl font-black text-white mt-3">
                      {premiumUsers}
                    </h2>
                  </div>

                  <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                    <Crown className="w-8 h-8 text-yellow-400" />
                  </div>
                </div>

                <div className="mt-6 text-xs text-slate-400">
                  Active paying subscribers
                </div>
              </motion.div>

              {/* YEARLY REVENUE */}
<motion.div
  initial={{
    opacity: 0,
    y: 20,
  }}
  animate={{
    opacity: 1,
    y: 0,
  }}
  transition={{
    delay: 0.2,
  }}
  className="bg-[#07110c] border border-emerald-500/10 rounded-3xl p-7"
>

  <div className="flex items-center justify-between">

    <div>
      <p className="text-slate-400 text-sm">
        Yearly Revenue
      </p>

      <h2 className="text-4xl font-black text-white mt-3 flex items-center">
        <IndianRupee className="w-8 h-8 text-emerald-400" />
        {yearlyRevenue.toLocaleString()}
      </h2>
    </div>

    <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
      <BadgeIndianRupee className="w-8 h-8 text-blue-400" />
    </div>
  </div>

  <div className="mt-6 text-xs text-slate-400">
    Estimated yearly subscription revenue
  </div>
</motion.div>
            </div>

            {/* REVENUE INSIGHTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* REVENUE BREAKDOWN */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.3,
                }}
                className="bg-[#07110c] border border-emerald-500/10 rounded-3xl p-8"
              >

                <div className="flex items-center gap-3 mb-8">

                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-emerald-400" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Revenue Breakdown
                    </h3>

                    <p className="text-slate-400 text-sm">
                      Premium subscription calculations
                    </p>
                  </div>
                </div>

                <div className="space-y-5">

                  <div className="flex items-center justify-between p-5 rounded-2xl bg-black/20 border border-white/5">

                    <span className="text-slate-400">
                      Premium Users
                    </span>

                    <span className="font-bold text-white">
                      {premiumUsers}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-5 rounded-2xl bg-black/20 border border-white/5">

                    <span className="text-slate-400">
                      Price Per Subscription
                    </span>

                    <span className="font-bold text-white">
                      ₹{premiumPlanPrice}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">

                    <span className="text-emerald-300 font-semibold">
                      Estimated Monthly Revenue
                    </span>

                    <span className="text-2xl font-black text-white">
                      ₹{revenue}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* PLATFORM OVERVIEW */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.4,
                }}
                className="bg-[#07110c] border border-emerald-500/10 rounded-3xl p-8"
              >

                <div className="flex items-center gap-3 mb-8">

                  <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center">
                    <BrainCircuit className="w-6 h-6 text-teal-400" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Platform Insights
                    </h3>

                    <p className="text-slate-400 text-sm">
                      Financial overview & growth
                    </p>
                  </div>
                </div>

                <div className="space-y-6">

                  <div>
                    <div className="flex justify-between text-sm mb-2">

                      <span className="text-slate-400">
                        Subscription Growth
                      </span>

                      <span className="text-emerald-400 font-bold">
                        82%
                      </span>
                    </div>

                    <div className="w-full h-3 bg-black/30 rounded-full overflow-hidden">

                      <div className="h-full w-[82%] bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">

                      <span className="text-slate-400">
                        Revenue Performance
                      </span>

                      <span className="text-emerald-400 font-bold">
                        91%
                      </span>
                    </div>

                    <div className="w-full h-3 bg-black/30 rounded-full overflow-hidden">

                      <div className="h-full w-[91%] bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full" />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-emerald-500/10">

                    <p className="text-slate-400 text-sm leading-7">
                      FinPilot AI premium subscriptions are generating stable recurring revenue through intelligent finance automation and AI-driven budgeting services.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}