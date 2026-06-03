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
  TrendingUp,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Sparkles
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

 const handleLogin = async (
  e: React.FormEvent
) => {

  e.preventDefault();

  setLoading(true);
  setErrorMessage("");

  try {

    const res = await api.post(
      "/auth/login",
      {
        email,
        password,
      }
    );

    // SAVE TOKEN

    localStorage.setItem(
      "token",
      res.data.accessToken
    );

    localStorage.setItem(
      "userId",
      res.data.user._id
    );

    // REMOVE VERIFY EMAIL

    localStorage.removeItem(
      "verifyEmail"
    );

    // REDIRECT

    router.push("/dashboard");

  } catch (error: any) {

    // ONLY LOG REAL SERVER/NETWORK ERRORS

    if (!error.response) {
      console.error(error);
    }

    const message =
      error?.response?.data?.message;

    const type =
      error?.response?.data?.type;

    // BLOCKED USER

    if (type === "BLOCKED") {

      setErrorMessage(
        "Your account has been blocked by admin."
      );

      return;
    }

    // UNVERIFIED USER

    if (type === "UNVERIFIED") {

      localStorage.setItem(
        "verifyEmail",
        email
      );

      setErrorMessage(
        "Email not verified. OTP sent to your email."
      );

      setTimeout(() => {

        router.push("/verify-otp");

      }, 1500);

      return;
    }

    // INVALID LOGIN

    if (
      message === "Invalid credentials"
    ) {

      setErrorMessage(
        "Invalid email or password."
      );

      return;
    }

    // FALLBACK ERROR

    setErrorMessage(
      message ||
      "Failed to log in. Please try again."
    );

  } finally {

    setLoading(false);

  }
};

  return (
    <main className="min-h-screen bg-[#030805] text-[#E2E8F0] antialiased flex overflow-hidden font-sans relative">
      {/* Background radial glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* SPLIT LAYOUT */}
      <div className="w-full grid lg:grid-cols-12 min-h-screen">
        
        {/* LEFT SIDE: Promotional & Analytics Visuals (Hidden on Mobile) */}
        <div className="hidden lg:flex lg:col-span-6 bg-[#040e09]/50 border-r border-emerald-950/40 p-12 flex-col justify-between relative overflow-hidden">
          {/* Subtle line mesh details */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#05170d_1px,transparent_1px),linear-gradient(to_bottom,#05170d_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
          
          {/* Top Logo */}
          <div className="relative flex items-center gap-2.5">
            <Link  href="/">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <BrainCircuit className="w-5.5 h-5.5 text-black" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              FinPilot <span className="text-emerald-400">AI</span>
            </span>
            </Link>
          </div>

          {/* Core Visual Widget Container */}
          <div className="relative space-y-8 my-auto max-w-md">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/20 px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                Intelligent Cash Flow Guard
              </div>
              <h2 className="text-3xl font-black text-white leading-tight">
                Securely manage your personal wealth assets.
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Connect your portfolios and let our AI analyze your transactions to generate optimized investment rules.
              </p>
            </div>

            {/* Quick Micro-stats Card */}
            <div className="bg-[#05110a] border border-emerald-500/10 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">AI Advisory Efficiency</span>
                <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-500/20">Optimized</span>
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
                    <span>Average Monthly Savings Growth</span>
                    <span className="text-emerald-400 font-bold">+18.2%</span>
                  </div>
                  <div className="w-full bg-[#0d1f14] h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-[82%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Trust List */}
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-xs text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Encrypted with AES-256 stateful SSL handshake</span>
              </li>
              <li className="flex items-center gap-3 text-xs text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Stateless session control utilizing secure JWT tokens</span>
              </li>
            </ul>
          </div>

          {/* Footer Text */}
          <div className="relative text-slate-500 text-xs">
            © 2026 FinPilot AI. All rights reserved. ISO-27001 Compliant.
          </div>
        </div>

        {/* RIGHT SIDE: Clean & Premium Login Form */}
        <div className="col-span-12 lg:col-span-6 flex flex-col justify-center px-6 sm:px-12 md:px-20 py-12 relative">
          
          {/* Logo visible only on mobile/tablet */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10 absolute top-8 left-8">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-black" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              FinPilot <span className="text-emerald-400">AI</span>
            </span>
          </div>

          <div className="w-full max-w-md mx-auto space-y-8">
            
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back</h1>
              <p className="text-slate-400 text-sm">
                Enter your credentials to access your financial co-pilot.
              </p>
            </div>

            {/* Error Message Box */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-start gap-3 text-xs leading-relaxed"
                >
                  <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Authentication error</span>
                    <p className="mt-0.5 text-red-300/90">{errorMessage}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              
              {/* Email Field */}
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
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#050f09] border border-emerald-500/15 focus:border-emerald-500/40 text-white placeholder-slate-600 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-300 tracking-wide block">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
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

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="rounded border-emerald-500/20 bg-[#050f09] text-emerald-500 focus:ring-emerald-500/30 h-4 w-4"
                  />
                  <span className="text-xs text-slate-400 font-medium">Keep me signed in</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-bold py-3.5 rounded-xl text-sm hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In to Account
                    <ArrowRight className="w-4.5 h-4.5" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom link to Register */}
            <div className="text-center pt-2">
              <p className="text-slate-400 text-xs">
                Don't have a FinPilot account yet?{" "}
                <Link
                  href="/register"
                  className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Create one here
                </Link>
              </p>
            </div>
          </div>
          
          {/* Security Banner at bottom */}
          <div className="mt-12 lg:mt-24 flex items-center justify-center gap-2 text-[10px] text-slate-500 tracking-wider uppercase font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-500/70" />
            <span>Encrypted Bank-level Data protection</span>
          </div>

        </div>
      </div>
    </main>
  );
}
