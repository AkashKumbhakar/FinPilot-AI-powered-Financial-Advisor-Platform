"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  BrainCircuit,
  AlertCircle,
  Sparkles,
  BadgeCheck,
  Activity,
} from "lucide-react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

export default function AdminLoginPage() {

  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const handleAdminLogin = async (
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

    // ROLE CHECK

    if (
      res.data.user.role !== "admin"
    ) {

      setErrorMessage(
        "Access denied. Admin account required."
      );

      return;
    }

    // SAVE ADMIN AUTH

    localStorage.setItem(
      "token",
      res.data.accessToken
    );

    localStorage.setItem(
      "userId",
      res.data.user._id
    );

    localStorage.setItem(
      "role",
      "admin"
    );

    // REMOVE VERIFY EMAIL

    localStorage.removeItem(
      "verifyEmail"
    );

    // REDIRECT

    router.push(
      "/admin/dashboard"
    );

  } catch (error: any) {

    // LOG ONLY REAL SERVER ERRORS

    if (!error.response) {
      console.error(error);
    }

    const message =
      error?.response?.data?.message;

    const type =
      error?.response?.data?.type;

    // BLOCKED ADMIN

    if (type === "BLOCKED") {

      setErrorMessage(
        "Your admin account has been blocked."
      );

      return;
    }

    // UNVERIFIED ADMIN

    if (type === "UNVERIFIED") {

      localStorage.setItem(
        "verifyEmail",
        email
      );

      setErrorMessage(
        "Email not verified. OTP sent to your email."
      );

      setTimeout(() => {

        router.push(
          "/verify-otp"
        );

      }, 1500);

      return;
    }

    // INVALID LOGIN

    if (
      message === "Invalid credentials"
    ) {

      setErrorMessage(
        "Invalid admin email or password."
      );

      return;
    }

    // FALLBACK ERROR

    setErrorMessage(
      message ||
      "Failed to authenticate admin."
    );

  } finally {

    setLoading(false);

  }
};

  return (
    <main className="min-h-screen bg-[#020704] text-[#E2E8F0] overflow-hidden relative flex">

      {/* BACKGROUND GLOWS */}

      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 blur-[160px] rounded-full pointer-events-none" />

      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/5 blur-[160px] rounded-full pointer-events-none" />

      {/* GRID */}

      <div className="w-full grid lg:grid-cols-12">

        {/* LEFT PANEL */}

        <div className="hidden lg:flex lg:col-span-6 border-r border-emerald-500/10 bg-[#04100a]/60 backdrop-blur-xl p-12 flex-col justify-between relative overflow-hidden">

          {/* GRID PATTERN */}

          <div className="absolute inset-0 bg-[linear-gradient(to_right,#052014_1px,transparent_1px),linear-gradient(to_bottom,#052014_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

          {/* LOGO */}

          <div className="relative flex items-center gap-3">

            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">

              <BrainCircuit className="w-6 h-6 text-black" />

            </div>

            <div>
            <Link  href="/">
              <h1 className="text-2xl font-black text-white tracking-tight">
                FinPilot{" "}
                <span className="text-emerald-400">
                  AI
                </span>
              </h1>

              <p className="text-xs text-slate-500 mt-1 tracking-wider uppercase">
                Admin Control Center
              </p>
            </Link>
            </div>

          </div>

          {/* HERO CONTENT */}

          <div className="relative max-w-lg space-y-10">

            <div className="space-y-5">

              <div className="inline-flex items-center gap-2 bg-emerald-950/30 border border-emerald-500/15 px-4 py-2 rounded-full text-xs font-bold text-emerald-400">

                <Sparkles className="w-3.5 h-3.5" />

                Secure Administrative Access

              </div>

              <h2 className="text-5xl font-black leading-tight text-white">

                Monitor platform operations intelligently.

              </h2>

              <p className="text-slate-400 text-sm leading-relaxed max-w-md">

                Access advanced administrative controls,
                manage subscriptions, oversee users,
                and monitor real-time financial activity
                securely through FinPilot AI.

              </p>

            </div>

            {/* FEATURE CARDS */}

            <div className="space-y-4">

              <div className="bg-[#07150e] border border-emerald-500/10 rounded-2xl p-5 flex items-start gap-4">

                <div className="h-11 w-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">

                  <BadgeCheck className="w-5 h-5 text-emerald-400" />

                </div>

                <div>

                  <h3 className="text-sm font-bold text-white">
                    User & Subscription Control
                  </h3>

                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Manage premium plans, account statuses,
                    and user access permissions.
                  </p>

                </div>

              </div>

              <div className="bg-[#07150e] border border-emerald-500/10 rounded-2xl p-5 flex items-start gap-4">

                <div className="h-11 w-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">

                  <Activity className="w-5 h-5 text-emerald-400" />

                </div>

                <div>

                  <h3 className="text-sm font-bold text-white">
                    Real-Time Analytics
                  </h3>

                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Track platform growth, financial insights,
                    and transaction activity instantly.
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* FOOTER */}

          <div className="relative flex items-center gap-2 text-xs text-slate-500">

            <ShieldCheck className="w-4 h-4 text-emerald-500/70" />

            ISO-27001 Secure Administrative Environment

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="col-span-12 lg:col-span-6 flex items-center justify-center px-6 py-12 relative">

          <div className="w-full max-w-md">

            {/* MOBILE LOGO */}

            <div className="lg:hidden flex items-center gap-3 mb-10">

              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">

                <BrainCircuit className="w-5 h-5 text-black" />

              </div>

              <h1 className="text-xl font-black text-white">
                FinPilot AI
              </h1>

            </div>

            {/* LOGIN CARD */}

            <div className="bg-[#05110b]/70 border border-emerald-500/10 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl shadow-emerald-500/5">

              <div className="space-y-2 mb-8">

                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-400">

                  <ShieldCheck className="w-3.5 h-3.5" />

                  ADMIN AUTHORIZATION

                </div>

                <h2 className="text-3xl font-black text-white tracking-tight">

                  Admin Login

                </h2>

                <p className="text-sm text-slate-400 leading-relaxed">

                  Enter your administrator credentials
                  to access the control dashboard.

                </p>

              </div>

              {/* ERROR */}

              <AnimatePresence>

                {errorMessage && (

                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -10,
                    }}
                    className="mb-5 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex gap-3 text-xs"
                  >

                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />

                    <div>

                      <span className="font-bold">
                        Authentication Failed
                      </span>

                      <p className="mt-1 text-red-300/90">
                        {errorMessage}
                      </p>

                    </div>

                  </motion.div>

                )}

              </AnimatePresence>

              {/* FORM */}

              <form
                onSubmit={handleAdminLogin}
                className="space-y-5"
              >

                {/* EMAIL */}

                <div>

                  <label className="text-xs font-semibold text-slate-300 tracking-wide">

                    Admin Email

                  </label>

                  <div className="relative mt-2">

                    <Mail className="w-4 h-4 absolute left-4 top-3.5 text-slate-500" />

                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      placeholder="admin@finpilot.ai"
                      className="w-full bg-[#050f09] border border-emerald-500/15 focus:border-emerald-500/40 rounded-xl py-3 pl-11 pr-4 text-sm text-white outline-none transition-all"
                    />

                  </div>

                </div>

                {/* PASSWORD */}

                <div>

                  <label className="text-xs font-semibold text-slate-300 tracking-wide">

                    Password

                  </label>

                  <div className="relative mt-2">

                    <Lock className="w-4 h-4 absolute left-4 top-3.5 text-slate-500" />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      required
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      placeholder="••••••••••••"
                      className="w-full bg-[#050f09] border border-emerald-500/15 focus:border-emerald-500/40 rounded-xl py-3 pl-11 pr-11 text-sm text-white outline-none transition-all"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      className="absolute right-4 top-3 text-slate-500 hover:text-slate-300 transition"
                    >

                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}

                    </button>

                  </div>

                </div>

                {/* BUTTON */}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-black py-3.5 rounded-xl text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >

                  {loading ? (

                    <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin" />

                  ) : (

                    <>
                      Access Admin Panel
                      <ArrowRight className="w-4 h-4" />
                    </>

                  )}

                </button>

              </form>

              {/* FOOTER */}

              <div className="mt-6 text-center">

                <Link
                  href="/"
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition"
                >

                  ← Back to Homepage

                </Link>

              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}