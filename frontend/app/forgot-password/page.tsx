"use client";

import { useState } from "react";

import Link from "next/link";

import api from "@/lib/axios";

import { motion, AnimatePresence } from "framer-motion";

import {
  BrainCircuit,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function ForgotPasswordPage() {

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  // =========================================
  // HANDLE FORGOT PASSWORD
  // =========================================

  const handleForgotPassword =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      setLoading(true);

      setSuccessMessage("");

      setErrorMessage("");

      try {

        const res =
          await api.post(
            "/auth/forgot-password",
            {
              email,
            }
          );

        setSuccessMessage(
          res.data.message ||
            "Password reset email sent successfully"
        );

        setEmail("");

      } catch (error: any) {

        console.log(error);

        setErrorMessage(
          error.response?.data
            ?.message ||
            "Something went wrong"
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <main
      className="
      min-h-screen
      bg-[#030805]
      text-[#E2E8F0]
      overflow-hidden
      relative
      flex
      "
    >

      {/* BACKGROUND GLOW */}

      <div
        className="
        absolute top-0 right-1/4
        w-[500px] h-[500px]
        bg-emerald-500/10
        rounded-full
        blur-[140px]
        pointer-events-none
        -z-10
        "
      />

      <div
        className="
        absolute bottom-0 left-1/4
        w-[500px] h-[500px]
        bg-teal-500/5
        rounded-full
        blur-[140px]
        pointer-events-none
        -z-10
        "
      />

      <div
        className="
        w-full
        grid lg:grid-cols-12
        min-h-screen
        "
      >

        {/* LEFT SIDE */}

        <div
          className="
          hidden lg:flex
          lg:col-span-6
          bg-[#040e09]/50
          border-r border-emerald-950/40
          p-12
          flex-col justify-between
          relative overflow-hidden
          "
        >

          {/* GRID */}

          <div
            className="
            absolute inset-0
            bg-[linear-gradient(to_right,#05170d_1px,transparent_1px),linear-gradient(to_bottom,#05170d_1px,transparent_1px)]
            bg-[size:4rem_4rem]
            opacity-30
            "
          />

          {/* LOGO */}

          <div
            className="
            relative
            flex items-center gap-3
            "
          >

            <div
              className="
              h-10 w-10
              rounded-xl
              bg-gradient-to-br
              from-emerald-400
              to-teal-500
              flex items-center justify-center
              "
            >

              <BrainCircuit
                className="
                w-5 h-5
                text-black
                "
              />

            </div>

            <h1
              className="
              text-2xl
              font-bold
              text-white
              "
            >

              FinPilot
              <span className="text-emerald-400">
                {" "}AI
              </span>

            </h1>
          </div>

          {/* CONTENT */}

          <div
            className="
            relative
            max-w-md
            space-y-8
            "
          >

            <div className="space-y-4">

              <div
                className="
                inline-flex
                items-center gap-2
                bg-emerald-950/40
                border border-emerald-500/20
                px-4 py-2
                rounded-full
                text-xs font-semibold
                text-emerald-400
                "
              >

                <Sparkles className="w-4 h-4" />

                Secure Recovery System

              </div>

              <h2
                className="
                text-4xl
                font-black
                leading-tight
                text-white
                "
              >

                Recover your account
                securely in minutes.

              </h2>

              <p
                className="
                text-slate-400
                text-sm
                leading-relaxed
                "
              >

                Enter your registered email address
                and we'll send you a secure password
                reset link instantly.

              </p>
            </div>

            {/* SECURITY CARD */}

            <div
              className="
              bg-[#05110a]
              border border-emerald-500/10
              rounded-2xl
              p-5
              space-y-4
              "
            >

              <div
                className="
                flex items-center gap-3
                "
              >

                <div
                  className="
                  w-10 h-10
                  rounded-xl
                  bg-emerald-500/10
                  border border-emerald-500/20
                  flex items-center justify-center
                  "
                >

                  <ShieldCheck
                    className="
                    w-5 h-5
                    text-emerald-400
                    "
                  />

                </div>

                <div>

                  <h3
                    className="
                    text-white
                    font-semibold
                    "
                  >

                    Protected Authentication

                  </h3>

                  <p
                    className="
                    text-xs
                    text-slate-400
                    mt-1
                    "
                  >

                    Reset links expire automatically
                    after 15 minutes.

                  </p>
                </div>
              </div>
            </div>

            {/* LIST */}

            <ul className="space-y-3">

              <li
                className="
                flex items-center gap-3
                text-sm text-slate-300
                "
              >

                <CheckCircle2
                  className="
                  w-4 h-4
                  text-emerald-400
                  "
                />

                One-time secure reset links

              </li>

              <li
                className="
                flex items-center gap-3
                text-sm text-slate-300
                "
              >

                <CheckCircle2
                  className="
                  w-4 h-4
                  text-emerald-400
                  "
                />

                AES-256 encrypted verification flow

              </li>
            </ul>
          </div>

          {/* FOOTER */}

          <div
            className="
            relative
            text-slate-500
            text-xs
            "
          >

            © 2026 FinPilot AI.
            All rights reserved.

          </div>
        </div>

        {/* RIGHT SIDE */}

        <div
          className="
          col-span-12 lg:col-span-6
          flex flex-col justify-center
          px-6 sm:px-12 md:px-20
          py-12
          relative
          "
        >

          {/* MOBILE LOGO */}

          <div
            className="
            lg:hidden
            flex items-center gap-2
            absolute top-8 left-8
            "
          >

            <div
              className="
              h-9 w-9
              rounded-xl
              bg-gradient-to-br
              from-emerald-400
              to-teal-500
              flex items-center justify-center
              "
            >

              <BrainCircuit
                className="
                w-5 h-5
                text-black
                "
              />

            </div>

            <span
              className="
              text-xl
              font-bold
              text-white
              "
            >

              FinPilot
              <span className="text-emerald-400">
                {" "}AI
              </span>

            </span>
          </div>

          {/* FORM */}

          <div
            className="
            w-full
            max-w-md
            mx-auto
            space-y-8
            "
          >

            {/* HEADER */}

            <div className="space-y-3">

              <h1
                className="
                text-3xl
                font-bold
                text-white
                "
              >

                Forgot Password?

              </h1>

              <p
                className="
                text-slate-400
                text-sm
                "
              >

                Enter your email address to receive
                a secure password reset link.

              </p>
            </div>

            {/* SUCCESS */}

            <AnimatePresence>

              {
                successMessage && (

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
                    className="
                    bg-emerald-500/10
                    border border-emerald-500/20
                    text-emerald-400
                    rounded-xl
                    p-4
                    flex items-start gap-3
                    text-sm
                    "
                  >

                    <CheckCircle2
                      className="
                      w-5 h-5
                      shrink-0
                      "
                    />

                    <p>
                      {successMessage}
                    </p>

                  </motion.div>
                )
              }

            </AnimatePresence>

            {/* ERROR */}

            <AnimatePresence>

              {
                errorMessage && (

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
                    className="
                    bg-red-500/10
                    border border-red-500/20
                    text-red-400
                    rounded-xl
                    p-4
                    flex items-start gap-3
                    text-sm
                    "
                  >

                    <AlertCircle
                      className="
                      w-5 h-5
                      shrink-0
                      "
                    />

                    <p>
                      {errorMessage}
                    </p>

                  </motion.div>
                )
              }

            </AnimatePresence>

            {/* FORM */}

            <form
              onSubmit={
                handleForgotPassword
              }
              className="space-y-5"
            >

              {/* EMAIL */}

              <div className="space-y-2">

                <label
                  className="
                  text-xs
                  font-semibold
                  text-slate-300
                  uppercase tracking-wider
                  "
                >

                  Email Address

                </label>

                <div className="relative">

                  <div
                    className="
                    absolute inset-y-0 left-0
                    pl-4
                    flex items-center
                    text-slate-500
                    "
                  >

                    <Mail className="w-4 h-4" />

                  </div>

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                    placeholder="name@example.com"
                    className="
                    w-full
                    bg-[#050f09]
                    border border-emerald-500/15
                    focus:border-emerald-500/40
                    rounded-xl
                    py-3.5
                    pl-11 pr-4
                    text-sm
                    text-white
                    placeholder-slate-600
                    outline-none
                    focus:ring-1
                    focus:ring-emerald-500/30
                    transition-all
                    "
                  />
                </div>
              </div>

              {/* BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="
                w-full
                bg-gradient-to-r
                from-emerald-500
                to-teal-600
                text-black
                font-bold
                py-3.5
                rounded-xl
                text-sm
                hover:from-emerald-400
                hover:to-teal-500
                transition-all
                duration-300
                flex items-center justify-center gap-2
                disabled:opacity-50
                "
              >

                {
                  loading ? (

                    <div
                      className="
                      h-5 w-5
                      border-2 border-black
                      border-t-transparent
                      rounded-full
                      animate-spin
                      "
                    />

                  ) : (

                    <>
                      Send Reset Link

                      <ArrowRight
                        className="
                        w-4 h-4
                        "
                      />
                    </>
                  )
                }

              </button>
            </form>

            {/* BACK */}

            <div className="text-center">

              <Link
                href="/login"
                className="
                text-sm
                text-emerald-400
                hover:text-emerald-300
                font-semibold
                transition
                "
              >

                ← Back to Login

              </Link>
            </div>
          </div>

          {/* FOOTER */}

          <div
            className="
            mt-16
            flex items-center justify-center gap-2
            text-[10px]
            text-slate-500
            uppercase
            tracking-widest
            font-semibold
            "
          >

            <ShieldCheck
              className="
              w-4 h-4
              text-emerald-500/70
              "
            />

            Bank-grade encrypted password recovery

          </div>
        </div>
      </div>
    </main>
  );
}