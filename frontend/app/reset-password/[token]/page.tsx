"use client";

import { useState } from "react";

import { useRouter, useParams } from "next/navigation";

import Link from "next/link";

import api from "@/lib/axios";

import { motion, AnimatePresence } from "framer-motion";

import {
  BrainCircuit,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function ResetPasswordPage() {

  const router = useRouter();

  const params = useParams();

  const token = params.token as string;

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  // =========================================
  // HANDLE RESET PASSWORD
  // =========================================

  const handleResetPassword =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      setLoading(true);

      setErrorMessage("");

      setSuccessMessage("");

      try {

        const res =
          await api.post(
            `/auth/reset-password/${token}`,
            {
              password,
              confirm_password:
                confirmPassword,
            }
          );

        setSuccessMessage(
          res.data.message ||
            "Password reset successful"
        );

        setPassword("");

        setConfirmPassword("");

        setTimeout(() => {

          router.push("/login");

        }, 2000);

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

      {/* BACKGROUND */}

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

        {/* LEFT */}

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

                Secure Password Recovery

              </div>

              <h2
                className="
                text-4xl
                font-black
                leading-tight
                text-white
                "
              >

                Create a new secure password.

              </h2>

              <p
                className="
                text-slate-400
                text-sm
                leading-relaxed
                "
              >

                Your new password should be
                unique and difficult to guess
                for maximum account security.

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

                    Bank-level Security

                  </h3>

                  <p
                    className="
                    text-xs
                    text-slate-400
                    mt-1
                    "
                  >

                    Your reset session is fully
                    encrypted and secured.

                  </p>
                </div>
              </div>
            </div>
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

        {/* RIGHT */}

        <div
          className="
          col-span-12 lg:col-span-6
          flex flex-col justify-center
          px-6 sm:px-12 md:px-20
          py-12
          relative
          "
        >

          <div
            className="
            w-full
            max-w-md
            mx-auto
            space-y-8
            "
          >

            {/* HEADER */}

            <div className="space-y-2">

              <h1
                className="
                text-3xl
                font-bold
                text-white
                "
              >

                Reset Password

              </h1>

              <p
                className="
                text-slate-400
                text-sm
                "
              >

                Enter your new password below.

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
                handleResetPassword
              }
              className="space-y-5"
            >

              {/* PASSWORD */}

              <div className="space-y-2">

                <label
                  className="
                  text-xs
                  font-semibold
                  text-slate-300
                  uppercase tracking-wider
                  "
                >

                  New Password

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

                    <Lock className="w-4 h-4" />

                  </div>

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    required
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    placeholder="Enter new password"
                    className="
                    w-full
                    bg-[#050f09]
                    border border-emerald-500/15
                    focus:border-emerald-500/40
                    rounded-xl
                    py-3.5
                    pl-11 pr-11
                    text-sm
                    text-white
                    placeholder-slate-600
                    outline-none
                    focus:ring-1
                    focus:ring-emerald-500/30
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="
                    absolute inset-y-0 right-0
                    pr-4
                    flex items-center
                    text-slate-500
                    hover:text-white
                    "
                  >

                    {
                      showPassword
                        ? (
                          <EyeOff className="w-4 h-4" />
                        )
                        : (
                          <Eye className="w-4 h-4" />
                        )
                    }

                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}

              <div className="space-y-2">

                <label
                  className="
                  text-xs
                  font-semibold
                  text-slate-300
                  uppercase tracking-wider
                  "
                >

                  Confirm Password

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

                    <Lock className="w-4 h-4" />

                  </div>

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    required
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    placeholder="Confirm password"
                    className="
                    w-full
                    bg-[#050f09]
                    border border-emerald-500/15
                    focus:border-emerald-500/40
                    rounded-xl
                    py-3.5
                    pl-11 pr-11
                    text-sm
                    text-white
                    placeholder-slate-600
                    outline-none
                    focus:ring-1
                    focus:ring-emerald-500/30
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="
                    absolute inset-y-0 right-0
                    pr-4
                    flex items-center
                    text-slate-500
                    hover:text-white
                    "
                  >

                    {
                      showConfirmPassword
                        ? (
                          <EyeOff className="w-4 h-4" />
                        )
                        : (
                          <Eye className="w-4 h-4" />
                        )
                    }

                  </button>
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
                      Reset Password

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

            {/* LOGIN */}

            <div className="text-center">

              <Link
                href="/login"
                className="
                text-sm
                text-emerald-400
                hover:text-emerald-300
                font-semibold
                "
              >

                ← Back to Login

              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}