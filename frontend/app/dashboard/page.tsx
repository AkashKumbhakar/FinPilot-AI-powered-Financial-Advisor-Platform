"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Activity,
  ArrowUpRight,
  IndianRupee,
  Receipt,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from "recharts";

interface SummaryData {
  totalIncome: number;
  totalExpense: number;
  totalSavings: number;
  savingsRate: string;
  financialHealth: string;
}

interface TrendData {
  month: string;
  year: number;
  totalExpense: number;
}

interface ExpenseData {
  _id: string;
  title: string;
  category: string;
  amount: number;
  expenseDate: string;
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [transactions, setTransactions] = useState<ExpenseData[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // FETCH DASHBOARD DATA
  const fetchDashboard = async () => {
    try {
      const [
        summaryRes,
        trendRes,
        dashboardRes,
        insightsRes,
      ] = await Promise.all([
        api.get("/income/analytics/summary"),
        api.get("/expense/last-6-months"),
        api.get("/expense/dashboard-summary"),
        api.get("/ai/insights"),
      ]);

      setSummary(summaryRes.data);
      setTrends(trendRes.data.data);
      setTransactions(dashboardRes.data.data.recentExpenses);
      setInsights(insightsRes.data.insights);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // HEALTH SCORE
  const getHealthScore = () => {
    if (summary?.financialHealth === "Excellent") return 95;
    if (summary?.financialHealth === "Good") return 80;
    if (summary?.financialHealth === "Average") return 60;
    return 40;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030805] flex items-center justify-center">
        <div className="h-14 w-14 rounded-full border-b-2 border-emerald-400 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden space-y-6">
      
      {/* TOP CARDS */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* INCOME */}
        <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-3xl p-6 relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-6">
            <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/10">
              <TrendingUp className="w-7 h-7 text-emerald-400" />
            </div>
            <span className="text-emerald-400 text-sm font-semibold uppercase tracking-wider">
              Income
            </span>
          </div>
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-2 font-medium">
            Total Income
          </p>
          <h2 className="text-4xl font-bold text-white">
            ₹{summary?.totalIncome?.toLocaleString()}
          </h2>
        </div>

        {/* EXPENSE */}
        <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-3xl p-6 relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-6">
            <div className="bg-red-500/10 p-4 rounded-2xl border border-red-500/10">
              <TrendingDown className="w-7 h-7 text-red-400" />
            </div>
            <span className="text-red-400 text-sm font-semibold uppercase tracking-wider">
              Expense
            </span>
          </div>
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-2 font-medium">
            Total Expense
          </p>
          <h2 className="text-4xl font-bold text-white">
            ₹{summary?.totalExpense?.toLocaleString()}
          </h2>
        </div>

        {/* SAVINGS */}
        <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-3xl p-6 relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-6">
            <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/10">
              <PiggyBank className="w-7 h-7 text-emerald-400" />
            </div>
            <span className="text-emerald-400 text-sm font-semibold uppercase tracking-wider">
              Savings
            </span>
          </div>
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-2 font-medium">
            Total Savings
          </p>
          <h2 className="text-4xl font-bold text-white">
            ₹{summary?.totalSavings?.toLocaleString()}
          </h2>
        </div>

        {/* HEALTH */}
        <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl p-6 text-black relative overflow-hidden group shadow-lg shadow-emerald-500/5">
          <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-6">
            <div className="bg-black/10 p-4 rounded-2xl border border-black/5">
              <Activity className="w-7 h-7" />
            </div>
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <p className="font-semibold text-xs uppercase tracking-wider mb-2">
            Financial Health
          </p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-5xl font-bold">
              {getHealthScore()}%
            </h2>
            <span className="text-xs font-bold bg-black/10 px-2.5 py-0.5 rounded-full border border-black/5">
              {summary?.financialHealth}
            </span>
          </div>
        </div>

      </div>

      {/* CHART + INSIGHTS */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* CHART */}
        <div className="lg:col-span-2 bg-[#050f09]/60 border border-emerald-500/10 rounded-3xl p-6 hover:border-emerald-500/15 transition duration-300">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Expense Trend
              </h2>
              <p className="text-slate-500 text-xs mt-1">
                Last 6 months analytics
              </p>
            </div>
            <div className="bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-sm font-semibold">
              Analytics
            </div>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                <defs>
                  <linearGradient id="expenseTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="month" 
                  stroke="#64748b" 
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "#050f09",
                    borderColor: "rgba(16, 185, 129, 0.2)",
                    borderRadius: "16px",
                    color: "#ffffff",
                    fontSize: "12px",
                  }}
                  itemStyle={{ color: "#10b981" }}
                  cursor={{ stroke: "rgba(16, 185, 129, 0.15)", strokeWidth: 1.5 }}
                />
                <Area
                  type="monotone"
                  dataKey="totalExpense"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#expenseTrend)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* INSIGHTS */}
        <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-3xl p-6 hover:border-emerald-500/15 transition duration-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8 pb-2 border-b border-emerald-500/10">
              <div className="bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20">
                <Wallet className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  AI Insights
                </h2>
                <p className="text-slate-500 text-xs">
                  Smart recommendations
                </p>
              </div>
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {insights && insights.map((item, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-[#0c1f14] to-[#040e09] border border-emerald-500/15 rounded-2xl p-5 shadow-inner relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-start gap-4">
                    <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20 shrink-0 mt-0.5">
                      <IndianRupee className="w-5 h-5 text-emerald-400" />
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      {item}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* RECENT TRANSACTIONS */}
      <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-3xl p-6 hover:border-emerald-500/15 transition duration-300">
        <div className="flex items-center justify-between mb-8 pb-2 border-b border-emerald-500/10">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Recent Expenses
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              Latest transactions
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {transactions && transactions.map((item) => (
            <div
              key={item._id}
              className="bg-[#07130c]/40 border border-emerald-500/5 hover:border-emerald-500/15 rounded-2xl p-5 flex items-center justify-between transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <div className="bg-red-500/10 p-3 rounded-2xl border border-red-500/20 shrink-0">
                  <Receipt className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    {item.title}
                  </h3>
                  <span className="inline-block text-[10px] font-bold tracking-wider uppercase bg-slate-800 border border-slate-700 text-slate-400 px-2.5 py-0.5 rounded mt-1">
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-lg text-red-400">
                  - ₹{item.amount?.toLocaleString()}
                </p>
                <p className="text-slate-500 text-xs mt-1 font-semibold">
                  {new Date(item.expenseDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}
