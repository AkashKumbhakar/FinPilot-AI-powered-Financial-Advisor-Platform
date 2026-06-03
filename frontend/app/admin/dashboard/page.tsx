"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
  Users,
  Crown,
  Wallet,
  TrendingUp,
  IndianRupee,
  ShieldCheck,
  Ban,
  Activity,
  Sparkles,
  UserCheck,
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  verifiedUsers: number;
  blockedUsers: number;
  premiumUsers: number;
  trialUsers: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  premiumPlanPrice: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] =
    useState<DashboardStats | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await api.get(
        "/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      gradient:
        "from-emerald-500 to-teal-500",
      bg: "bg-emerald-500/10",
      border:
        "border-emerald-500/20",
      text: "text-emerald-400",
    },

    {
      title: "Premium Users",
      value: stats?.premiumUsers || 0,
      icon: Crown,
      gradient:
        "from-yellow-500 to-orange-500",
      bg: "bg-yellow-500/10",
      border:
        "border-yellow-500/20",
      text: "text-yellow-400",
    },

    {
      title: "Verified Users",
      value: stats?.verifiedUsers || 0,
      icon: UserCheck,
      gradient:
        "from-cyan-500 to-blue-500",
      bg: "bg-cyan-500/10",
      border:
        "border-cyan-500/20",
      text: "text-cyan-400",
    },

    {
      title: "Blocked Users",
      value: stats?.blockedUsers || 0,
      icon: Ban,
      gradient:
        "from-red-500 to-rose-500",
      bg: "bg-red-500/10",
      border:
        "border-red-500/20",
      text: "text-red-400",
    },

    {
      title: "Trial Users",
      value: stats?.trialUsers || 0,
      icon: Activity,
      gradient:
        "from-violet-500 to-fuchsia-500",
      bg: "bg-violet-500/10",
      border:
        "border-violet-500/20",
      text: "text-violet-400",
    },

    {
      title: "Active Subscriptions",
      value:
        stats?.activeSubscriptions || 0,
      icon: ShieldCheck,
      gradient:
        "from-indigo-500 to-sky-500",
      bg: "bg-indigo-500/10",
      border:
        "border-indigo-500/20",
      text: "text-indigo-400",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030805] flex items-center justify-center text-white">
        <div className="h-12 w-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#030805] text-white overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px]" />

      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[140px]" />

      {/* HEADER */}
      <section className="border-b border-emerald-950/40 sticky top-0 z-40 backdrop-blur-xl bg-[#030805]/80">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/15 px-3 py-1.5 rounded-full text-[11px] font-bold text-emerald-400 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              FINPILOT AI ADMIN PANEL
            </div>

            <h1 className="text-3xl font-black tracking-tight">
              Admin Dashboard
            </h1>

            <p className="text-slate-400 mt-2 text-sm">
              Monitor platform growth,
              subscriptions, revenue and
              users.
            </p>
          </div>

          <div className="bg-[#07110c] border border-emerald-500/10 rounded-2xl px-5 py-4 min-w-[250px]">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
              Monthly Revenue
            </p>

            <div className="flex items-center gap-2 mt-2">
              <IndianRupee className="w-7 h-7 text-emerald-400" />

              <h2 className="text-3xl font-black text-emerald-400">
                {stats?.monthlyRevenue || 0}
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* STATS GRID */}
      <section className="max-w-7xl mx-auto px-6 py-10">

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

          {cards.map((card, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-3xl border ${card.border} bg-[#07110c] p-6`}
            >
              <div
                className={`absolute inset-0 opacity-10 bg-gradient-to-br ${card.gradient}`}
              />

              <div className="relative flex items-start justify-between">

                <div>
                  <p className="text-slate-400 text-sm font-medium">
                    {card.title}
                  </p>

                  <h2 className="text-4xl font-black mt-3">
                    {card.value}
                  </h2>
                </div>

                <div
                  className={`h-14 w-14 rounded-2xl ${card.bg} border ${card.border} flex items-center justify-center`}
                >
                  <card.icon
                    className={`w-7 h-7 ${card.text}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* BUSINESS OVERVIEW */}
<div className="grid lg:grid-cols-2 gap-8 mt-10">

  {/* REVENUE OVERVIEW */}
  <div className="bg-[#07110c] border border-emerald-500/10 rounded-3xl p-7">

    <div className="flex items-center justify-between mb-8">
      <div>
        <p className="text-sm text-slate-400">
          Revenue Overview
        </p>

        <h2 className="text-2xl font-black mt-2">
          Subscription Revenue
        </h2>
      </div>

      <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
        <IndianRupee className="w-8 h-8 text-emerald-400" />
      </div>
    </div>

    <div className="space-y-5">

      <div className="flex items-center justify-between bg-[#030805] rounded-2xl p-4 border border-emerald-500/10">
        <span className="text-slate-400">
          Monthly Revenue
        </span>

        <span className="font-black text-emerald-400 text-xl">
          ₹{stats?.monthlyRevenue}
        </span>
      </div>

      <div className="flex items-center justify-between bg-[#030805] rounded-2xl p-4 border border-emerald-500/10">
        <span className="text-slate-400">
          Yearly Revenue
        </span>

        <span className="font-black text-cyan-400 text-xl">
          ₹{stats?.yearlyRevenue}
        </span>
      </div>

      <div className="flex items-center justify-between bg-[#030805] rounded-2xl p-4 border border-emerald-500/10">
        <span className="text-slate-400">
          Premium Plan
        </span>

        <span className="font-black text-yellow-400 text-xl">
          ₹{stats?.premiumPlanPrice}
        </span>
      </div>

    </div>
  </div>

  {/* USER DISTRIBUTION */}
  <div className="bg-[#07110c] border border-emerald-500/10 rounded-3xl p-7">

    <div className="flex items-center justify-between mb-8">
      <div>
        <p className="text-sm text-slate-400">
          User Distribution
        </p>

        <h2 className="text-2xl font-black mt-2">
          Platform Insights
        </h2>
      </div>

      <TrendingUp className="w-8 h-8 text-emerald-400" />
    </div>

    <div className="space-y-6">

      {/* Premium */}
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>Premium Users</span>

          <span>
            {Math.round(
              ((stats?.premiumUsers || 0) /
                (stats?.totalUsers || 1)) *
                100
            )}%
          </span>
        </div>

        <div className="h-3 rounded-full bg-[#030805] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
            style={{
              width: `${Math.round(
                ((stats?.premiumUsers || 0) /
                  (stats?.totalUsers || 1)) *
                  100
              )}%`,
            }}
          />
        </div>
      </div>

      {/* Verified */}
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>Verified Users</span>

          <span>
            {Math.round(
              ((stats?.verifiedUsers || 0) /
                (stats?.totalUsers || 1)) *
                100
            )}%
          </span>
        </div>

        <div className="h-3 rounded-full bg-[#030805] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
            style={{
              width: `${Math.round(
                ((stats?.verifiedUsers || 0) /
                  (stats?.totalUsers || 1)) *
                  100
              )}%`,
            }}
          />
        </div>
      </div>

      {/* Trial */}
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>Trial Users</span>

          <span>
            {Math.round(
              ((stats?.trialUsers || 0) /
                (stats?.totalUsers || 1)) *
                100
            )}%
          </span>
        </div>

        <div className="h-3 rounded-full bg-[#030805] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
            style={{
              width: `${Math.round(
                ((stats?.trialUsers || 0) /
                  (stats?.totalUsers || 1)) *
                  100
              )}%`,
            }}
          />
        </div>
      </div>

    </div>
  </div>

</div>

        {/* SYSTEM STATUS */}
        <div className="mt-10 bg-[#07110c] border border-emerald-500/10 rounded-3xl p-7">

  <h2 className="text-2xl font-black mb-8">
    System Health
  </h2>

  <div className="grid md:grid-cols-4 gap-5">

    <div className="bg-[#030805] rounded-2xl p-5 border border-emerald-500/10">
      <div className="flex items-center gap-2 text-emerald-400 font-semibold">
        <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        API Online
      </div>
    </div>

    <div className="bg-[#030805] rounded-2xl p-5 border border-emerald-500/10">
      <div className="flex items-center gap-2 text-emerald-400 font-semibold">
        <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        Database Connected
      </div>
    </div>

    <div className="bg-[#030805] rounded-2xl p-5 border border-emerald-500/10">
      <div className="flex items-center gap-2 text-emerald-400 font-semibold">
        <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        Authentication Active
      </div>
    </div>

    <div className="bg-[#030805] rounded-2xl p-5 border border-emerald-500/10">
      <div className="flex items-center gap-2 text-emerald-400 font-semibold">
        <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        Subscriptions Running
      </div>
    </div>

  </div>
</div>

      </section>
    </main>
  );
}