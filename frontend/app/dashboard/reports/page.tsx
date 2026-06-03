"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "react-toastify";
import {
  FileText,
  Download,
  TrendingUp,
  TrendingDown,
  Wallet,
  IndianRupee,
  Receipt,
  ArrowDownCircle,
  ArrowUpCircle,
  Sparkles
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

interface ReportData {
  totalIncome: number;
  totalExpense: number;
  totalSavings: number;
}

// Custom theme coordinates: Income (Emerald), Expense (Rose Red), Savings (Teal)
const COLORS = [
  "#22c55e", // Income -  Green
  "#ef4444", // Expense -  Red
  "#f59e0b", // Savings - Yellow
];

export default function ReportsPage() {
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  // FETCH REPORT SUMMARY
  const fetchReportData = async () => {
    try {
      const res = await api.get("/income/analytics/summary");
      setReport({
        totalIncome: res.data.totalIncome,
        totalExpense: res.data.totalExpense,
        totalSavings: res.data.totalSavings,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  // DOWNLOAD PDF REPORT
  const downloadReport = async () => {
    try {
      const response = await api.get("/report/financial-report", {
        responseType: "blob",
      });

      // CREATE FILE URL
      const file = new Blob([response.data], {
        type: "application/pdf",
      });
      const fileURL = window.URL.createObjectURL(file);

      // CREATE DOWNLOAD LINK
      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", "financial-report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();

      // CLEANUP
      window.URL.revokeObjectURL(fileURL);
      toast.success("Report downloaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to download report");
    }
  };

  const chartData = [
    {
      name: "Income",
      value: report?.totalIncome || 0,
    },
    {
      name: "Expense",
      value: report?.totalExpense || 0,
    },
    {
      name: "Savings",
      value: report?.totalSavings || 0,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#030805]">
        <div className="h-14 w-14 rounded-full border-b-2 border-emerald-400 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-[#E2E8F0] font-sans">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 bg-[#050f09] border border-emerald-500/10 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white leading-none">
            Financial Reports
          </h1>
          <p className="text-slate-500 text-xs mt-2 font-medium">
            Download statements, analyze saving ratios, and review transaction assets.
          </p>
        </div>

        <button
          onClick={downloadReport}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-bold px-6 py-4 rounded-xl text-sm hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Download PDF Report
        </button>
      </div>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* INCOME */}
        <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300 shadow-sm">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl" />
          <div className="flex items-center justify-between mb-6">
            <div className="bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/20">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
              Earnings
            </span>
          </div>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">
            Total Income
          </p>
          <h2 className="text-3xl font-extrabold text-white">
            ₹{report?.totalIncome?.toLocaleString() || "0"}
          </h2>
        </div>

        {/* EXPENSE */}
        <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300 shadow-sm">
          <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/5 rounded-full blur-xl" />
          <div className="flex items-center justify-between mb-6">
            <div className="bg-red-500/10 p-3.5 rounded-xl border border-red-500/20">
              <TrendingDown className="w-6 h-6 text-red-400" />
            </div>
            <span className="text-red-400 text-xs font-bold uppercase tracking-wider">
              Spending
            </span>
          </div>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">
            Total Expense
          </p>
          <h2 className="text-3xl font-extrabold text-white">
            ₹{report?.totalExpense?.toLocaleString() || "0"}
          </h2>
        </div>

        {/* SAVINGS */}
        <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl p-6 text-black shadow-lg shadow-emerald-500/5 relative overflow-hidden group hover:scale-[1.01] transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-6">
            <div className="bg-black/10 p-3.5 rounded-xl border border-black/5">
              <Wallet className="w-6 h-6" />
            </div>
            <IndianRupee className="w-6 h-6" />
          </div>
          <p className="font-semibold text-xs uppercase tracking-wider mb-1.5">
            Total Savings
          </p>
          <h2 className="text-4xl font-black">
            ₹{report?.totalSavings?.toLocaleString() || "0"}
          </h2>
        </div>

      </div>

      {/* CHART */}
      <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-2xl p-6 hover:border-emerald-500/15 transition duration-300">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-white text-base font-bold">Financial Analytics</h2>
            <p className="text-slate-500 text-xs mt-1">Income vs Expense vs Savings distribution</p>
          </div>
          <div className="bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-sm font-semibold">
            Financial Overview
          </div>
        </div>

        <div className="h-[360px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={110}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index]}
                    stroke="#050f09"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: "#050f09",
                  borderColor: "rgba(16, 185, 129, 0.2)",
                  borderRadius: "16px",
                  color: "#ffffff",
                  fontSize: "12px",
                }}
                itemStyle={{ color: "#34d399" }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span className="text-slate-400 text-xs font-semibold">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* REPORT INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SAVINGS CARD */}
        <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-2xl p-6 hover:border-emerald-500/20 transition-all duration-300 shadow-sm">
          <div className="bg-teal-500/10 w-12 h-12 rounded-xl border border-teal-500/20 flex items-center justify-center mb-6">
            <Wallet className="w-5.5 h-5.5 text-teal-400" />
          </div>
          <h3 className="text-base font-bold text-white mb-2.5">
            Savings Insight
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Your current savings are <span className="text-teal-400 font-bold">₹{report?.totalSavings?.toLocaleString()}</span>. Maintain a healthy savings ratio for better long-term financial stability.
          </p>
        </div>

        {/* INCOME CARD */}
        <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-2xl p-6 hover:border-emerald-500/20 transition-all duration-300 shadow-sm">
          <div className="bg-emerald-500/10 w-12 h-12 rounded-xl border border-emerald-500/20 flex items-center justify-center mb-6">
            <ArrowUpCircle className="w-5.5 h-5.5 text-emerald-400" />
          </div>
          <h3 className="text-base font-bold text-white mb-2.5">
            Income Analysis
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Your total income generated is <span className="text-emerald-400 font-bold">₹{report?.totalIncome?.toLocaleString()}</span>. Consistent income growth allows for compounding SIP allocations.
          </p>
        </div>

        {/* EXPENSE CARD */}
        <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-2xl p-6 hover:border-emerald-500/20 transition-all duration-300 shadow-sm">
          <div className="bg-red-500/10 w-12 h-12 rounded-xl border border-red-500/20 flex items-center justify-center mb-6">
            <ArrowDownCircle className="w-5.5 h-5.5 text-red-400" />
          </div>
          <h3 className="text-base font-bold text-white mb-2.5">
            Expense Analysis
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Your total spending is <span className="text-red-400 font-bold">₹{report?.totalExpense?.toLocaleString()}</span>. Monitor discretionary expenses to maximize monthly savings indexes.
          </p>
        </div>

      </div>

      {/* REPORT FEATURES */}
      <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-3.5 mb-8 pb-3 border-b border-emerald-500/10">
          <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
            <FileText className="w-5.5 h-5.5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white leading-none">Included In Report</h2>
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block mt-1">PDF statement breakdown contents</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          
          <div className="bg-[#07130c]/40 border border-emerald-500/5 hover:border-emerald-500/15 rounded-xl p-5 transition-all">
            <Receipt className="w-6 h-6 text-red-400 mb-4" />
            <h4 className="font-bold text-white text-sm mb-1">Expense Details</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Full categorical expense transaction logs.
            </p>
          </div>

          <div className="bg-[#07130c]/40 border border-emerald-500/5 hover:border-emerald-500/15 rounded-xl p-5 transition-all">
            <TrendingUp className="w-6 h-6 text-emerald-400 mb-4" />
            <h4 className="font-bold text-white text-sm mb-1">Income Details</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Complete income stream deposit indexes.
            </p>
          </div>

          <div className="bg-[#07130c]/40 border border-emerald-500/5 hover:border-emerald-500/15 rounded-xl p-5 transition-all">
            <Wallet className="w-6 h-6 text-teal-400 mb-4" />
            <h4 className="font-bold text-white text-sm mb-1">Savings Report</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Comprehensive savings pool aggregation.
            </p>
          </div>

          <div className="bg-[#07130c]/40 border border-emerald-500/5 hover:border-emerald-500/15 rounded-xl p-5 transition-all">
            <Sparkles className="w-6 h-6 text-yellow-400 mb-4" />
            <h4 className="font-bold text-white text-sm mb-1">AI Summary</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Predictive models and machine learning notes.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
