"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import {
  CheckCircle2,
  Loader2,
  Crown,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (!sessionId) return;
        const res = await api.post("/subscription/verify-subscription", {
          sessionId,
        });

        if (res.data.success) {
          setSuccess(true);
        }
      } catch (error) {
        console.error("Payment success verification error:", error);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

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
        w-full max-w-xl
        rounded-2xl
        border border-emerald-500/10
        bg-[#050f09]/60
        p-10
        text-center
        relative
        overflow-hidden
        shadow-xl shadow-emerald-950/20
        "
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

        {loading ? (
          <>
            <div
              className="
              mx-auto
              h-20 w-20
              rounded-2xl
              bg-emerald-500/10
              border border-emerald-500/20
              flex items-center justify-center
              mb-6
              "
            >
              <Loader2
                className="
                w-10 h-10
                text-emerald-400
                animate-spin
                "
              />
            </div>

            <h1
              className="
              text-3xl font-extrabold text-white
              "
            >
              Verifying Payment...
            </h1>

            <p
              className="
              text-slate-400
              mt-3
              text-sm
              "
            >
              Please wait while we activate your subscription.
            </p>
          </>
        ) : success ? (
          <>
            <div
              className="
              mx-auto
              h-24 w-24
              rounded-full
              bg-emerald-500/10
              border border-emerald-500/20
              flex items-center justify-center
              mb-6
              shadow-lg shadow-emerald-500/5
              "
            >
              <CheckCircle2
                className="
                w-14 h-14
                text-emerald-400
                "
              />
            </div>

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
              <Crown className="w-4 h-4 text-emerald-400" />
              Premium Activated
            </div>

            <h1
              className="
              text-4xl font-black text-white
              "
            >
              Payment Successful 🎉
            </h1>

            <p
              className="
              text-slate-400
              mt-4 leading-relaxed text-sm max-w-md mx-auto
              "
            >
              Your subscription has been activated successfully. Enjoy all premium
              AI financial features.
            </p>

            <button
              onClick={() => router.push("/dashboard")}
              className="
              mt-8
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
              inline-flex items-center gap-2
              transition-all duration-300
              shadow-lg shadow-emerald-500/10
              hover:shadow-emerald-500/25
              hover:-translate-y-0.5
              "
            >
              Go To Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <div
              className="
              mx-auto
              h-20 w-20
              rounded-2xl
              bg-rose-500/10
              border border-rose-500/20
              flex items-center justify-center
              mb-6
              "
            >
              <AlertTriangle
                className="
                w-10 h-10
                text-rose-400
                "
              />
            </div>

            <h1
              className="
              text-3xl font-extrabold
              text-rose-500
              "
            >
              Verification Failed
            </h1>

            <p
              className="
              text-slate-400
              mt-3
              text-sm
              "
            >
              We could not verify your payment. If you have been charged, please contact support.
            </p>

            <button
              onClick={() => router.push("/dashboard/billing")}
              className="
              mt-8
              bg-rose-500/10
              hover:bg-rose-500/20
              border border-rose-500/20
              text-rose-400
              px-6 py-3
              rounded-xl
              font-bold
              text-sm
              inline-flex items-center gap-2
              transition-all duration-300
              "
            >
              Back to Billing
            </button>
          </>
        )}
      </div>
    </div>
  );
}
