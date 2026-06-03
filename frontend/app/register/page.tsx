"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  BrainCircuit,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Sparkles,
  User,
  BadgeCheck,
  Wallet,
  TrendingUp
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      setSuccessMessage(
        res.data.message || "Account created successfully! Redirecting..."
      );

      setTimeout(() => {
        router.push("/verify-otp");
      }, 1500);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(
        error.response?.data?.message ||
        "Registration failed. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#030805] text-[#E2E8F0] antialiased flex overflow-hidden relative font-sans">
      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* GRID LAYOUT */}
      <div className="w-full grid lg:grid-cols-12 min-h-screen">
        
        {/* LEFT SIDE: Branding & Features (Hidden on mobile) */}
        <div className="hidden lg:flex lg:col-span-6 bg-[#040e09]/50 border-r border-emerald-950/40 p-12 flex-col justify-between relative overflow-hidden">
          {/* Grid pattern masking overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#05170d_1px,transparent_1px),linear-gradient(to_bottom,#05170d_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />

          {/* Logo Header */}
          <div className="relative flex items-center gap-2.5">
            <Link href='/'>
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <BrainCircuit className="w-5.5 h-5.5 text-black" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              FinPilot <span className="text-emerald-400">AI</span>
            </span>
            </Link>
          </div>

          {/* Marketing Content & Metrics */}
          <div className="relative max-w-md space-y-8 my-auto">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-400">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                AI-Powered Wealth Intelligence
              </div>
              
              <h2 className="text-4xl font-black text-white leading-tight">
                Build smarter money habits with automated guidance.
              </h2>
              
              <p className="text-slate-400 text-sm leading-relaxed">
                Unlock actionable cash flow alerts, track customized spending targets, and simulate future wealth models on our unified financial platform.
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="space-y-4 pt-2">
              <div className="bg-[#05110a] border border-emerald-500/10 rounded-2xl p-5 hover:border-emerald-500/20 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <Wallet className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Smart Expense Analytics</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Visualize cash flow trends automatically mapped across spending categories.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#05110a] border border-emerald-500/10 rounded-2xl p-5 hover:border-emerald-500/20 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <BadgeCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Automated Advisor Advice</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Receive suggestions to optimize liquid investments and reduce budget overflows.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick trust metrics checklist */}
            <div className="space-y-2.5 pt-2 border-t border-emerald-950/40 border-dashed">
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero-risk read-only API sync protocols</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Advanced bcrypt session password shielding</span>
              </div>
            </div>
          </div>

          {/* Footer Rights */}
          <div className="relative text-xs text-slate-500">
            © 2026 FinPilot AI. All rights reserved. ISO-27001 Certified.
          </div>
        </div>

        {/* RIGHT SIDE: Interactive Registration Form */}
        <div className="col-span-12 lg:col-span-6 flex flex-col justify-center px-6 sm:px-12 md:px-20 py-12 relative overflow-y-auto max-h-screen">
          
          {/* Logo visible only on mobile/tablet */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10 absolute top-8 left-8">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-black" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              FinPilot <span className="text-emerald-400">AI</span>
            </span>
          </div>

          <div className="w-full max-w-md mx-auto space-y-8 pt-10 lg:pt-0">
            
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-white">Create your account</h1>
              <p className="text-slate-400 text-sm">
                Get started today and optimize your personal net worth with AI.
              </p>
            </div>

            {/* Alert Messages (Errors and Success notifications) */}
            <AnimatePresence mode="wait">
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-start gap-3 text-xs leading-relaxed"
                >
                  <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Registration failed</span>
                    <p className="mt-0.5 text-red-300/90">{errorMessage}</p>
                  </div>
                </motion.div>
              )}

              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-start gap-3 text-xs leading-relaxed"
                >
                  <CheckCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Success</span>
                    <p className="mt-0.5 text-emerald-300/90">{successMessage}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Form */}
            <form onSubmit={handleRegister} className="space-y-4">
              
              {/* Name field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 tracking-wide block">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#050f09] border border-emerald-500/15 focus:border-emerald-500/40 text-white placeholder-slate-600 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all"
                  />
                </div>
              </div>

              {/* Email field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 tracking-wide block">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#050f09] border border-emerald-500/15 focus:border-emerald-500/40 text-white placeholder-slate-600 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 tracking-wide block">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#050f09] border border-emerald-500/15 focus:border-emerald-500/40 text-white placeholder-slate-600 rounded-xl py-3 pl-11 pr-11 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 tracking-wide block">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#050f09] border border-emerald-500/15 focus:border-emerald-500/40 text-white placeholder-slate-600 rounded-xl py-3 pl-11 pr-11 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-bold py-3.5 rounded-xl text-sm hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <div className="h-5 w-5  border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Create Free Account
                    <ArrowRight className="w-4.5 h-4.5" />
                  </>
                )}
              </button>
            </form>

            {/* Login Navigation */}
            <div className="text-center">
              <p className="text-slate-400 text-xs">
                Already have a FinPilot account?{" "}
                <Link
                  href="/login"
                  className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>

          {/* Secure Footer Indicator */}
          <div className="mt-12 flex items-center justify-center gap-2 text-[10px] text-slate-500 tracking-wider uppercase font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-500/70" />
            <span>Bank-grade encrypted security protocols</span>
          </div>

        </div>
      </div>
    </main>
  );
}
