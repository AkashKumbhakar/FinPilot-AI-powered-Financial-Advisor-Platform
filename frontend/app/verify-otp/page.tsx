"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BrainCircuit,
  Mail,
  KeyRound,
  ArrowRight,
  CheckCircle,
  ShieldCheck,
  AlertCircle,
  Sparkles,
} from "lucide-react";

export default function VerifyOtpPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [resending, setResending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {

  const savedEmail =
    localStorage.getItem(
      "verifyEmail"
    );

  if (savedEmail) {
    setEmail(savedEmail);
  }

}, []);
useEffect(() => {

  let interval: NodeJS.Timeout;

  if (timer > 0) {

    interval = setInterval(() => {

      setTimer((prev) => prev - 1);

    }, 1000);
  }

  return () => clearInterval(interval);

}, [timer]);
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await api.post("/auth/verify-otp", {
        email,
        otp,
      });
      setSuccessMessage( "OTP Verified! Please Login..." );
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message ||
          "Invalid OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  const handleResendOtp =
  async () => {

    try {

      setResending(true);

      setErrorMessage("");
      setSuccessMessage("");

      const res =
        await api.post(
          "/auth/resend-otp",
          {
            email,
          }
        );

      setSuccessMessage(
        res.data.message
      );

      // RESET TIMER
      setTimer(60);

    } catch (error: any) {

      setErrorMessage(
        error.response?.data
          ?.message ||
          "Failed to resend OTP"
      );

    } finally {

      setResending(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#030805] text-[#E2E8F0] flex items-center justify-center px-6 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px]" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[140px]" />

      {/* CARD */}
      <div className="w-full max-w-md bg-[#050f09]/70 border border-emerald-500/10 backdrop-blur-xl rounded-3xl p-8 shadow-xl">

        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <BrainCircuit className="w-6 h-6 text-black" />
            </div>
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
                    <span className="font-bold">Verification failed</span>
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

          <h1 className="text-2xl font-bold text-white">
            Verify OTP
          </h1>

          <p className="text-sm text-slate-400">
            Enter the OTP sent to your email
          </p>
        </div>

        

        {/* FORM */}
        <form onSubmit={handleVerifyOtp} className="space-y-5">

          {/* EMAIL */}
          <div>
            <label className="text-xs text-slate-300 font-semibold">
              Email Address
            </label>
            <div className="relative mt-2">
              <Mail className="w-4 h-4 absolute left-3 top-3.5 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#050f09] border border-emerald-500/15 focus:border-emerald-500/40 rounded-xl py-3 pl-10 pr-4 text-sm text-white outline-none"
              />
            </div>
          </div>

          {/* OTP */}
          <div>
            <label className="text-xs text-slate-300 font-semibold">
              OTP Code
            </label>
            <div className="relative mt-2">
              <KeyRound className="w-4 h-4 absolute left-3 top-3.5 text-slate-500" />
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                className="w-full bg-[#050f09] border border-emerald-500/15 focus:border-emerald-500/40 rounded-xl py-3 pl-10 pr-4 text-sm text-white tracking-widest text-center outline-none"
              />
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Verify OTP
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
          <div className="text-center pt-2">

  {
    timer > 0 ? (

      <p
        className="
        text-xs
        text-slate-500
        "
      >
        Resend OTP in{" "}
        <span className="text-emerald-400 font-semibold">
          {timer}s
        </span>
      </p>

    ) : (

      <button
        type="button"
        onClick={handleResendOtp}
        disabled={resending}
        className="
        text-sm
        text-emerald-400
        hover:text-emerald-300
        font-semibold
        transition
        "
      >

        {
          resending
            ? "Resending..."
            : "Resend OTP"
        }

      </button>
    )
  }

</div>
        </form>

        {/* FOOTER */}
        <div className="mt-6 text-center text-[11px] text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500/70" />
          Secure verification powered by FinPilot AI
        </div>
      </div>
    </main>
  );
}