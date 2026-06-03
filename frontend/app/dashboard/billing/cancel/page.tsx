"use client";

import Link from "next/link";
import {
  XCircle,
  ArrowLeft,
  CreditCard,
} from "lucide-react";

export default function BillingCancelPage() {
  return (
    <div
      className="
      min-h-[80vh]
      flex items-center justify-center
      px-6
      text-[#E2E8F0]
      font-sans
      "
    >
      <div
        className="
        max-w-xl
        w-full
        bg-[#050f09]/60
        border border-emerald-500/10
        rounded-2xl
        p-10
        text-center
        relative
        overflow-hidden
        shadow-xl shadow-emerald-950/20
        "
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

        <div
          className="
          h-24 w-24
          mx-auto
          rounded-full
          bg-rose-500/10
          border border-rose-500/20
          flex items-center justify-center
          mb-8
          shadow-lg shadow-rose-500/5
          "
        >
          <XCircle className="w-12 h-12 text-rose-400" />
        </div>

        <h1 className="text-4xl font-extrabold text-white">
          Payment Cancelled
        </h1>

        <p className="text-slate-400 mt-4 text-sm leading-relaxed max-w-sm mx-auto">
          Your subscription payment was cancelled or could not be completed.
        </p>

        <div
          className="
          mt-8
          bg-rose-500/5
          border border-rose-500/10
          rounded-xl
          p-5
          "
        >
          <div className="flex items-center justify-center gap-3 text-rose-400 text-sm">
            <CreditCard className="w-5 h-5" />
            <span className="font-bold">
              No money was charged
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <Link
            href="/dashboard/billing"
            className="
            inline-flex
            items-center
            justify-center
            bg-gradient-to-r
            from-emerald-500
            to-teal-600
            hover:from-emerald-400
            hover:to-teal-500
            text-black
            px-8 py-4
            rounded-xl
            font-bold
            text-sm
            transition-all duration-300
            shadow-lg shadow-emerald-500/10
            hover:shadow-emerald-500/25
            hover:-translate-y-0.5
            "
          >
            Retry Payment
          </Link>

          <Link
            href="/dashboard"
            className="
            inline-flex
            items-center
            justify-center
            gap-2
            bg-[#050f09]
            hover:bg-[#0c2013]
            border border-emerald-500/20
            text-emerald-400
            px-8 py-4
            rounded-xl
            font-bold
            text-sm
            transition-all duration-300
            "
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
