"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Wallet,
  Bell,
  BrainCircuit,
  TrendingUp,
  Sparkles,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  ChevronRight,
  CheckCircle,
  CheckCircle2,
  LineChart,
  Lock,
  Layers,
  Check,
  Menu,
  X,
} from "lucide-react";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("advisor");

  const features = [
    {
      title: "AI Financial Advisor",
      description:
        "Get smart AI-powered financial suggestions based on your spending habits.",
      icon: BrainCircuit,
      badge: "Self-Learning",
      color: "from-emerald-400 to-green-500",
    },
    {
      title: "Expense Tracking",
      description:
        "Track daily expenses with beautiful analytics and category insights.",
      icon: Wallet,
      badge: "Automated",
      color: "from-green-400 to-teal-500",
    },
    {
      title: "Real-Time Alerts",
      description:
        "Receive instant notifications for budgets, recurring payments, and savings goals.",
      icon: Bell,
      badge: "Instant",
      color: "from-teal-400 to-emerald-500",
    },
    {
      title: "Secure Platform",
      description:
        "JWT authentication, encrypted passwords, and secure APIs for complete protection.",
      icon: ShieldCheck,
      badge: "Bank-Grade",
      color: "from-emerald-500 to-green-600",
    },
  ];

  const recentTransactions = [
    {
      name: "Salary Credit",
      category: "Income",
      amount: "+₹1,25,000",
      time: "Today, 10:00 AM",
      type: "income",
    },
    {
      name: "Organic Grocery",
      category: "Food & Dining",
      amount: "-₹3,450",
      time: "Yesterday",
      type: "expense",
    },
    {
      name: "Mutual Fund SIP",
      category: "Investment",
      amount: "-₹10,000",
      time: "2 days ago",
      type: "investment",
    },
  ];

  const advisorInsights = [
    {
      type: "alert",
      message:
        "Your dining out expenses have exceeded your typical weekly average by 18%.",
      suggestion:
        "Consider cooking at home this weekend to stay within your ₹12,000 monthly food budget.",
    },
    {
      type: "opportunity",
      message:
        "You have ₹22,000 sitting idle in your savings account earning 3% interest.",
      suggestion:
        "Allocate ₹15,000 to a liquid mutual fund to yield an estimated 6.5% interest.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#030805] text-[#E2E8F0] antialiased overflow-x-hidden font-sans">
      {/* Background Glow effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-emerald-600/5 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* NAVBAR */}
      <header className="w-full border-b border-emerald-950/40 backdrop-blur-xl sticky top-0 z-50 bg-[#030805]/75">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <BrainCircuit className="w-6 h-6 text-black" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white bg-clip-text bg-gradient-to-r from-white via-slate-100 to-emerald-400">
              FinPilot <span className="text-emerald-400">AI</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a
              href="#features"
              className="hover:text-emerald-400 transition-colors duration-200"
            >
              Features
            </a>
            <a
              href="#analytics"
              className="hover:text-emerald-400 transition-colors duration-200"
            >
              Analytics Demo
            </a>
            <a
              href="#security"
              className="hover:text-emerald-400 transition-colors duration-200"
            >
              Security
            </a>
            <a
              href="#pricing"
              className="hover:text-emerald-400 transition-colors duration-200"
            >
              Pricing
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-semibold text-slate-300 hover:text-white transition-colors duration-200"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-black px-5 py-2.5 rounded-xl text-sm font-bold hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all duration-300 hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white focus:outline-none"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-emerald-950/40 bg-[#030805] px-6 py-6 space-y-4"
            >
              <nav className="flex flex-col gap-4 text-base font-medium text-slate-300">
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-emerald-400 transition"
                >
                  Features
                </a>
                <a
                  href="#analytics"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-emerald-400 transition"
                >
                  Analytics Demo
                </a>
                <a
                  href="#security"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-emerald-400 transition"
                >
                  Security
                </a>
                <a
                  href="#pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-emerald-400 transition"
                >
                  Pricing
                </a>
              </nav>
              <hr className="border-emerald-950/40" />
              <div className="flex flex-col gap-3">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-slate-300 hover:text-white font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center bg-gradient-to-r from-emerald-500 to-teal-600 text-black py-2.5 rounded-xl font-bold hover:from-emerald-400 hover:to-teal-500"
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28 overflow-hidden">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* LEFT SIDE TEXT */}
          <motion.div
            className="lg:col-span-7 space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/20 px-4 py-2 rounded-full text-xs font-semibold text-emerald-400 tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              Next-Gen Autonomous Wealth Management
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
              Wealth Management
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-400 to-teal-500">
                Smarter & Guided by AI
              </span>
            </h1>

            <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-xl">
              Take complete control of your financial destiny. Analyze cash
              flows, auto-optimize budgets, track goals, and receive custom
              wealth-building recommendations powered by machine learning.
            </p>

            {/* Social Trust Metrics */}
            <div className="pt-2 flex flex-wrap gap-8 text-sm border-t border-emerald-950/40 border-dashed max-w-xl">
              <div>
                <p className="text-2xl font-bold text-white">₹140B+</p>
                <p className="text-slate-500 text-xs mt-0.5">
                  Transactions Analyzed
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">99.8%</p>
                <p className="text-slate-500 text-xs mt-0.5">
                  Advice Accuracy Rate
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">256-Bit</p>
                <p className="text-slate-500 text-xs mt-0.5">
                  SSL Bank Encryption
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/register"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-black px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="#analytics"
                className="bg-emerald-950/20 border border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400 hover:text-emerald-300 px-8 py-4 rounded-2xl font-bold transition-all duration-200"
              >
                Watch Demo
              </Link>
            </div>
          </motion.div>

          {/* RIGHT SIDE INTERACTIVE DASHBOARD GRAPHIC */}
          <motion.div
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            {/* Soft decorative glow behind card */}
            <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] opacity-30 rounded-full" />

            <div className="relative bg-[#06120b] border border-emerald-500/20 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-emerald-950/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-semibold">
                      Net Worth Balance
                    </h4>
                    <p className="text-emerald-500 text-xs font-semibold">
                      Live Advisor Feed
                    </p>
                  </div>
                </div>
                <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-500/20 flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +18.2% MoM
                </div>
              </div>

              {/* Total Balance */}
              <div className="mb-6">
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                  Total Savings & Assets
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white">
                    ₹2,45,000
                  </span>
                  <span className="text-slate-400 text-sm">INR</span>
                </div>
              </div>

              {/* Mini Budget Bars */}
              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                    <span>Dining & Groceries Budget</span>
                    <span className="text-emerald-400">
                      ₹8,000 / ₹10,000 (80%)
                    </span>
                  </div>
                  <div className="w-full bg-[#0d1f14] rounded-full h-2.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-green-400 h-full rounded-full w-[80%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                    <span>Investment SIP Goals</span>
                    <span className="text-teal-400">
                      ₹16,250 / ₹25,000 (65%)
                    </span>
                  </div>
                  <div className="w-full bg-[#0d1f14] rounded-full h-2.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full w-[65%]" />
                  </div>
                </div>
              </div>

              {/* Dynamic AI Recommendation Widget */}
              <div className="bg-gradient-to-br from-[#0c1f14] to-[#040e09] border border-emerald-500/20 rounded-2xl p-4 shadow-inner relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl" />
                <div className="flex items-center gap-2 mb-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4.5 h-4.5 text-emerald-400" />
                  AI Smart Recommendation
                </div>
                <p className="text-sm font-medium text-slate-200">
                  "Reduce dining out budget by 12% and route the ₹3,000 savings
                  to Liquid SIPs. You will accumulate an extra ₹40,800 by
                  December."
                </p>
                <div className="flex justify-end gap-2 mt-3">
                  <button className="text-slate-400 hover:text-slate-200 text-xs font-bold px-3 py-1.5 transition">
                    Dismiss
                  </button>
                  <button className="bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-bold px-3.5 py-1.5 rounded-lg transition shadow-md shadow-emerald-400/10">
                    Auto-Apply
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CORE CAPABILITIES SECTION */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 relative">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-950/30 border border-emerald-500/15 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-400">
            <Layers className="w-3.5 h-3.5" />
            Designed For Growth
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Designed for Smarter Decisions
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-base">
            Achieve financial freedom with customized tools that automate budget
            rules, monitor investments, and forecast wealth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ y: -8, borderColor: "rgba(16, 185, 129, 0.4)" }}
                className="bg-[#050f09] border border-emerald-500/10 rounded-2xl p-6 hover:bg-[#07170e]/80 transition-all duration-300 group shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="bg-emerald-500/10 w-12 h-12 rounded-xl flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all duration-300">
                      <Icon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/5 border border-emerald-500/20 rounded-full px-2.5 py-0.5 uppercase tracking-wider">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold mb-2 text-white group-hover:text-emerald-400 transition-colors duration-200">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    {feature.description}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 cursor-pointer pt-2 group-hover:gap-2.5 transition-all">
                  Learn More <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* DETAILED INTERACTIVE DEMO SECTION (ANALYTICS & AI DIALOGUE) */}
      <section
        id="analytics"
        className="max-w-7xl mx-auto px-6 py-20 bg-gradient-to-b from-transparent via-emerald-950/10 to-transparent"
      >
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Interactive Chat Window/Live AI Dialogue Demo */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-950/30 border border-emerald-500/15 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-400">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Live AI Advisor Simulator
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Ask any financial question. <br />
              Receive bank-grade answers.
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              Toggle between standard advisor modules to explore the custom
              strategies generated from your transactions. No generic rules,
              only personalized feedback.
            </p>

            <div className="flex gap-2.5 p-1 bg-[#06120b] border border-emerald-500/15 rounded-xl max-w-md">
              <button
                onClick={() => setActiveTab("advisor")}
                className={`flex-1 text-xs py-2.5 rounded-lg font-bold transition-all duration-200 ${
                  activeTab === "advisor"
                    ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/10"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                AI Financial Advisor
              </button>
              <button
                onClick={() => setActiveTab("insights")}
                className={`flex-1 text-xs py-2.5 rounded-lg font-bold transition-all duration-200 ${
                  activeTab === "insights"
                    ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/10"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Cash Flow Insights
              </button>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white text-sm font-semibold">
                    Real-time spending categorizations
                  </h4>
                  <p className="text-slate-400 text-xs">
                    Instantly checks merchants and segments expenses into 12
                    buckets.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white text-sm font-semibold">
                    Compound Growth Modeling
                  </h4>
                  <p className="text-slate-400 text-xs">
                    Simulates interest rates to match your desired retirement
                    target.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Card showing simulation */}
          <div className="lg:col-span-6">
            <div className="bg-[#050f09] border border-emerald-500/25 rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] overflow-hidden">
              {/* Header */}
              <div className="bg-[#08150d] p-4 flex items-center justify-between border-b border-emerald-500/10">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="text-xs text-slate-400 ml-2 font-mono">
                    finpilot-terminal v1.4
                  </span>
                </div>
                <span className="text-[10px] text-emerald-500/80 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10 uppercase tracking-widest font-mono">
                  Online
                </span>
              </div>

              {/* Chat Content Panel */}
              <div className="p-6 space-y-6 min-h-[340px] flex flex-col justify-between">
                {activeTab === "advisor" ? (
                  <div className="space-y-4">
                    {/* User Message */}
                    <div className="flex items-end gap-2.5 justify-end">
                      <div className="bg-emerald-950/60 border border-emerald-500/20 text-slate-200 rounded-2xl rounded-tr-none px-4 py-3 text-xs max-w-[80%] shadow-sm">
                        "Hey Pilot, what is the fastest way to save ₹50,000 for
                        my travel fund?"
                      </div>
                    </div>

                    {/* AI Message */}
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
                        <BrainCircuit className="w-5 h-5 text-black" />
                      </div>
                      <div className="bg-[#0b1a11] border border-emerald-500/15 text-slate-200 rounded-2xl rounded-tl-none px-4 py-3.5 text-xs max-w-[85%] space-y-2.5 shadow-sm">
                        <p>
                          Based on your transaction analytics, I recommend these
                          adjustments to achieve the ₹50,000 goal in 5 months:
                        </p>
                        <ul className="space-y-1.5 list-disc pl-4 text-slate-400 text-[11px]">
                          <li>
                            Automate a monthly transfer of ₹10,000 to a separate
                            high-yield liquid fund.
                          </li>
                          <li>
                            Limit entertainment subscription spending to
                            ₹1,500/month.
                          </li>
                          <li>
                            Cancel 2 active unused software memberships
                            (detected on May 12th).
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-xs font-bold">
                        Transaction Stream Feed
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        Updated 3 mins ago
                      </span>
                    </div>

                    {/* Transaction List */}
                    <div className="space-y-2">
                      {recentTransactions.map((tx, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-xl bg-[#09150e]/60 border border-emerald-500/5 hover:border-emerald-500/15 transition-all duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold ${
                                tx.type === "income"
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : "bg-slate-800 text-slate-300"
                              }`}
                            >
                              {tx.type === "income" ? (
                                <ArrowUpRight className="w-4 h-4" />
                              ) : (
                                <ArrowDownRight className="w-4 h-4" />
                              )}
                            </div>
                            <div>
                              <h5 className="text-white text-xs font-semibold">
                                {tx.name}
                              </h5>
                              <span className="text-[10px] text-slate-500">
                                {tx.time}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span
                              className={`text-xs font-bold ${
                                tx.type === "income"
                                  ? "text-emerald-400"
                                  : "text-slate-200"
                              }`}
                            >
                              {tx.amount}
                            </span>
                            <p className="text-[9px] text-slate-500 font-semibold uppercase">
                              {tx.category}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Bar Simulation */}
                <div className="flex gap-2 items-center border-t border-emerald-500/10 pt-4 mt-2">
                  <div className="flex-1 bg-[#0b1a11] border border-emerald-500/10 rounded-xl px-3 py-2 flex items-center text-xs text-slate-500">
                    Ask FinPilot...
                  </div>
                  <button className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-xl text-xs font-bold transition">
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECURITY & COMPLIANCE */}
      <section
        id="security"
        className="max-w-7xl mx-auto px-6 py-20 border-t border-emerald-950/40 relative"
      >
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1 relative">
            {/* Visual showing security layers */}
            <div className="bg-[#050f09] border border-emerald-500/20 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-emerald-500/10">
                <Lock className="w-5 h-5 text-emerald-400" />
                <h4 className="text-white text-sm font-bold">
                  Encrypted Credentials
                </h4>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 bg-[#09150e] rounded-xl border border-emerald-500/10">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs text-slate-300 font-semibold font-mono">
                      JWT SECURE TOKEN
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-[#09150e] rounded-xl border border-emerald-500/10">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs text-slate-300 font-semibold font-mono">
                      BCRYPT-HASHED PASSWORDS
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Secure
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-[#09150e] rounded-xl border border-emerald-500/10">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs text-slate-300 font-semibold font-mono">
                      AES-256 API SSL
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Certified
                  </span>
                </div>
              </div>

              <div className="pt-2 text-center">
                <span className="text-[11px] text-slate-500 font-medium">
                  FinPilot uses sandboxed read-only bank feeds. Your money is
                  never stored on our servers.
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-950/30 border border-emerald-500/15 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Security First Architecture
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Bank-Grade Security & Vault Encryption
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              We understand the critical importance of financial data integrity.
              Our backend uses modern standards including JSON Web Tokens (JWT)
              for stateless sessions, bcrypt for state-of-the-art password
              hashing, and restricted database configurations.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <h4 className="text-white text-sm font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Read-Only Database Sync
                </h4>
                <p className="text-slate-400 text-xs">
                  We analyze transaction patterns but cannot execute fund
                  transfers. Your money is 100% untouched.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-white text-sm font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Multi-Factor Handshake
                </h4>
                <p className="text-slate-400 text-xs">
                  Device-level authorization protocols block suspicious login
                  attempts automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING / MEMBERSHIP */}
      <section
        id="pricing"
        className="max-w-7xl mx-auto px-6 py-20 border-t border-emerald-950/40"
      >
        <div className="text-center mb-16 space-y-4">
          <div
            className="
      inline-flex items-center gap-2
      bg-emerald-950/30
      border border-emerald-500/15
      px-3.5 py-1.5
      rounded-full
      text-xs font-bold
      text-emerald-400
      "
          >
            <Sparkles className="w-3.5 h-3.5" />
            Smart Membership Plans
          </div>

          <h2
            className="
      text-3xl sm:text-4xl
      font-extrabold
      text-white
      tracking-tight
      "
          >
            Choose your AI finance experience
          </h2>

          <p
            className="
      text-slate-400
      max-w-2xl
      mx-auto
      text-base
      leading-relaxed
      "
          >
            Start managing your income, expenses, budgets and AI insights for
            free. Upgrade anytime to unlock premium analytics, advanced reports
            and intelligent financial automation.
          </p>
        </div>

        <div
          className="
    grid md:grid-cols-2
    gap-8
    max-w-4xl
    mx-auto
    "
        >
          {/* TRIAL PLAN */}

          <div
            className="
      bg-[#050f09]
      border border-emerald-500/10
      rounded-3xl
      p-8
      hover:border-emerald-500/25
      transition-all duration-300
      flex flex-col justify-between
      "
          >
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-white text-xl font-bold">Trial Plan</h3>

                <div
                  className="
            px-3 py-1
            rounded-full
            bg-emerald-500/10
            border border-emerald-500/20
            text-emerald-400
            text-[10px]
            font-bold uppercase
            tracking-widest
            "
                >
                  Free
                </div>
              </div>

              <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                Perfect for students and individuals who want to track expenses
                and manage budgets smartly.
              </p>

              <div className="my-8">
                <span className="text-5xl font-black text-white">₹0</span>

                <span className="text-slate-400 text-sm"> / forever</span>
              </div>

              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />

                  <span>Add income & expenses manually</span>
                </li>

                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />

                  <span>Expense category management</span>
                </li>

                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />

                  <span>Monthly budget tracking</span>
                </li>

                <li className="flex items-center gap-3 text-slate-500">
                  <span>Limited AI financial insights</span>
                </li>

                <li className="flex items-center gap-3 text-slate-500">
                  <span>No advanced analytics dashboard</span>
                </li>
              </ul>
            </div>

            <Link
              href="/register"
              className="
        mt-10
        block w-full
        text-center
        border border-emerald-500/20
        hover:border-emerald-500/40
        text-emerald-400
        font-bold
        py-3.5
        rounded-2xl
        text-sm
        transition-all
        "
            >
              Get Started Free
            </Link>
          </div>

          {/* PREMIUM PLAN */}

          <div
            className="
      relative
      bg-gradient-to-b
      from-[#08170e]
      to-[#06110b]
      border-2 border-emerald-500
      rounded-3xl
      p-8
      shadow-2xl shadow-emerald-500/10
      flex flex-col justify-between
      "
          >
            {/* BADGE */}

            <div
              className="
        absolute
        -top-3.5 left-1/2
        -translate-x-1/2
        bg-emerald-500
        text-black
        text-[10px]
        uppercase
        font-black
        tracking-[0.2em]
        px-4 py-1.5
        rounded-full
        "
            >
              PREMIUM
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-white text-xl font-bold">Premium Plan</h3>

                <div
                  className="
            px-3 py-1
            rounded-full
            bg-emerald-500/10
            border border-emerald-500/20
            text-emerald-400
            text-[10px]
            font-bold uppercase
            tracking-widest
            "
                >
                  Most Popular
                </div>
              </div>

              <p className="text-emerald-300 text-sm mt-2 leading-relaxed">
                Unlock AI-powered financial intelligence, smart reports and
                premium automation tools.
              </p>

              <div className="my-8">
                <span className="text-5xl font-black text-white">₹299</span>

                <span className="text-slate-400 text-sm"> / month</span>
              </div>

              <ul className="space-y-4 text-sm text-slate-200">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />

                  <span>Advanced analytics dashboard</span>
                </li>

                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />

                  <span>AI-powered financial insights</span>
                </li>

                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />

                  <span>Smart budget recommendations</span>
                </li>

                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />

                  <span>Real-time notifications & reminders</span>
                </li>

                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />

                  <span>Detailed expense reports & charts</span>
                </li>

                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />

                  <span>Priority premium support</span>
                </li>
              </ul>
            </div>

            <Link
              href="/register"
              className="
        mt-10
        block w-full
        text-center
        bg-gradient-to-r
        from-emerald-500
        to-teal-500
        hover:from-emerald-400
        hover:to-teal-400
        text-black
        font-black
        py-3.5
        rounded-2xl
        text-sm
        transition-all duration-300
        shadow-lg shadow-emerald-500/20
        hover:-translate-y-0.5
        "
            >
              Upgrade to Premium
            </Link>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="relative bg-gradient-to-r from-emerald-900/60 to-emerald-950/60 border border-emerald-500/30 rounded-[32px] sm:rounded-[40px] p-8 sm:p-12 md:p-16 text-center shadow-2xl overflow-hidden backdrop-blur-md">
          {/* Decorative glow inside */}
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-[100px]" />
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-teal-500/15 rounded-full blur-[100px]" />

          <div className="relative space-y-6 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Ready to autopilot your savings?
            </h2>

            <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-xl mx-auto">
              Setting up takes less than 2 minutes. Sync your budget, configure
              goals, and let FinPilot optimize your savings algorithm instantly.
            </p>

            <div className="pt-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-400 to-teal-500 text-black px-8 py-4 rounded-2xl font-bold shadow-lg shadow-emerald-500/20 hover:from-emerald-300 hover:to-teal-400 transition-all duration-300 hover:-translate-y-0.5"
              >
                Create Your Account Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-emerald-950/50 py-12 mt-10 bg-[#020503]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
                <BrainCircuit className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                FinPilot <span className="text-emerald-400">AI</span>
              </span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              Your intelligent, secure AI-powered companion for wealth tracking,
              automated budgets, and goal forecasting.
            </p>
          </div>

          <div>
            <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Core Platform
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a
                  href="#features"
                  className="hover:text-emerald-400 transition"
                >
                  Features Overview
                </a>
              </li>
              <li>
                <a
                  href="#analytics"
                  className="hover:text-emerald-400 transition"
                >
                  Interactive Advisor
                </a>
              </li>
              <li>
                <a
                  href="#security"
                  className="hover:text-emerald-400 transition"
                >
                  Data Security Protocols
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="hover:text-emerald-400 transition"
                >
                  Pricing Plans
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Legal & Trust
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a href="#" className="hover:text-emerald-400 transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400 transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400 transition">
                  ISO-27001 Certification
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400 transition">
                  Developer Security
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Get Updates
            </h5>
            <p className="text-slate-500 text-xs mb-3">
              Subscribe to receive smart budget briefs monthly.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="you@domain.com"
                className="bg-[#06120b] border border-emerald-500/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/30 flex-1"
              />
              <button className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-3 py-2 rounded-xl text-xs transition">
                Go
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-emerald-950/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-xs">
          <p>
            © 2026 FinPilot AI. Built with MERN Stack & Next.js. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-400 transition">
              Help Center
            </a>
            <a href="#" className="hover:text-slate-400 transition">
              Documentation
            </a>
            <a href="#" className="hover:text-slate-400 transition">
              Status
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
