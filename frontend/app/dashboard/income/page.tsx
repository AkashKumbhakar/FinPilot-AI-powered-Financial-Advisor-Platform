"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "react-toastify";
import {
  TrendingUp,
  IndianRupee,
  Wallet,
  Plus,
  Calendar,
  Briefcase,
  Landmark,
  Pencil,
  Trash2,
  X,
  Sparkles
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from "recharts";

interface IncomeData {
  _id: string;
  source: string;
  amount: number;
  category: string;
  incomeDate: string;
}

interface SummaryData {
  totalIncome: number;
  totalExpense: number;
  totalSavings: number;
  savingsRate: string;
  financialHealth: string;
}

export default function IncomePage() {
  const [income, setIncome] = useState<IncomeData[]>([]);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [incomeData, setIncomeData] = useState({
    source: "",
    amount: "",
    category: "",
    incomeDate: "",
  });

  // FETCH INCOME
  const fetchIncome = async () => {
    try {
      const [incomeRes, summaryRes] = await Promise.all([
        api.get("/income/all"),
        api.get("/income/analytics/summary"),
      ]);

      setIncome(incomeRes.data.data || []);
      setSummary(summaryRes.data);
    } catch (error) {
      console.error("Error fetching income streams:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  // HANDLE INPUT CHANGE
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setIncomeData({
      ...incomeData,
      [e.target.name]: e.target.value,
    });
  };

  // ADD INCOME
  const handleAddIncome = async () => {
    try {
      await api.post("/income/create", incomeData);
      toast.success("Income added successfully");
      fetchIncome();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error adding income statement:", error);
      toast.error("Failed to add income");
    }
  };

  // UPDATE INCOME
  const handleUpdateIncome = async () => {
    try {
      await api.put(`/income/update/${editingId}`, incomeData);
      toast.success("Income updated");
      fetchIncome();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error updating income record:", error);
      toast.error("Update failed");
    }
  };

  // DELETE INCOME
  const deleteIncome = async (id: string) => {
    try {
      await api.delete(`/income/delete/${id}`);
      toast.success("Income deleted");
      fetchIncome();
    } catch (error) {
      console.error("Error deleting income transaction:", error);
      toast.error("Delete failed");
    }
  };

  // EDIT BUTTON
  const handleEditClick = (item: IncomeData) => {
    setEditingId(item._id);
    setIncomeData({
      source: item.source,
      amount: item.amount.toString(),
      category: item.category,
      incomeDate: item.incomeDate.split("T")[0],
    });
    setShowModal(true);
  };

  // RESET FORM
  const resetForm = () => {
    setEditingId(null);
    setIncomeData({
      source: "",
      amount: "",
      category: "",
      incomeDate: "",
    });
  };

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
            Income Management
          </h1>
          <p className="text-slate-500 text-xs mt-2 font-medium">
            Monitor earnings sources, calculate allocations, and analyze saving metrics.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-bold px-6 py-4 rounded-xl text-sm hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Income
        </button>
      </div>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* TOTAL INCOME */}
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
            ₹{summary?.totalIncome?.toLocaleString() || "0"}
          </h2>
        </div>

        {/* SAVINGS */}
        <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300 shadow-sm">
          <div className="absolute top-0 right-0 w-20 h-20 bg-teal-500/5 rounded-full blur-xl" />
          <div className="flex items-center justify-between mb-6">
            <div className="bg-teal-500/10 p-3.5 rounded-xl border border-teal-500/20">
              <Wallet className="w-6 h-6 text-teal-400" />
            </div>
            <span className="text-teal-400 text-xs font-bold uppercase tracking-wider">
              Savings
            </span>
          </div>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">
            Total Savings
          </p>
          <h2 className="text-3xl font-extrabold text-white">
            ₹{summary?.totalSavings?.toLocaleString() || "0"}
          </h2>
        </div>

        {/* SAVINGS RATE */}
        <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl p-6 text-black shadow-lg shadow-emerald-500/5 relative overflow-hidden group hover:scale-[1.01] transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-6">
            <div className="bg-black/10 p-3.5 rounded-xl border border-black/5">
              <IndianRupee className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold bg-black/10 px-2.5 py-0.5 rounded-full border border-black/5">
              {summary?.financialHealth}
            </span>
          </div>
          <p className="font-semibold text-xs uppercase tracking-wider mb-1.5">
            Savings Rate
          </p>
          <h2 className="text-4xl font-black">
            {summary?.savingsRate}%
          </h2>
        </div>

      </div>

      {/* CHART */}
      <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-2xl p-6 hover:border-emerald-500/15 transition duration-300">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-white text-base font-bold">Income Analytics</h2>
            <p className="text-slate-500 text-xs mt-1">Earnings allocation distribution</p>
          </div>
          <div className="bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-sm font-semibold">
            Monthly Analysis
          </div>
        </div>

        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={income} margin={{ top: 10, right: 30, left: 50, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="source" 
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
                dataKey="amount"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#incomeGlow)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* INCOME LEDGER HISTORY */}
      <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="mb-8 pb-3 border-b border-emerald-500/10">
          <h2 className="text-lg font-bold text-white">Income History</h2>
          <p className="text-slate-500 text-xs mt-1">Ledger transactions listing earnings and deposits</p>
        </div>

        <div className="space-y-4 max-h-[600px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {income.map((item) => (
            <div
              key={item._id}
              className="bg-[#07130c]/40 border border-emerald-500/5 hover:border-emerald-500/15 rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5 transition-all duration-200"
            >
              
              {/* LEFT INFO BLOCK */}
              <div className="flex items-center gap-4">
                <div className="bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/20 shrink-0">
                  {item.category === "Salary" ? (
                    <Briefcase className="w-5.5 h-5.5 text-emerald-400" />
                  ) : (
                    <Landmark className="w-5.5 h-5.5 text-emerald-400" />
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">
                    {item.source}
                  </h3>
                  
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="inline-block text-[9px] font-bold tracking-wider uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
                      {item.category}
                    </span>

                    <span className="h-1 w-1 rounded-full bg-slate-700" />

                    <div className="flex items-center gap-1 text-slate-500 text-[10px] font-semibold">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(item.incomeDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT ACTIONS BLOCK */}
              <div className="flex items-center justify-between lg:justify-end gap-5 border-t lg:border-t-0 pt-4 lg:pt-0 border-emerald-950/20">
                <div className="text-left lg:text-right">
                  <p className="text-lg font-extrabold text-emerald-400">
                    + ₹{item.amount?.toLocaleString()}
                  </p>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mt-0.5">
                    Credited
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditClick(item)}
                    className="bg-emerald-500/10 hover:bg-emerald-500/20 p-2.5 rounded-lg border border-emerald-500/20 transition text-emerald-400 focus:outline-none"
                    title="Edit Income Record"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => deleteIncome(item._id)}
                    className="bg-red-500/10 hover:bg-red-500/20 p-2.5 rounded-lg border border-red-500/20 transition text-red-400 focus:outline-none"
                    title="Delete Income Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}

          {income.length === 0 && (
            <div className="py-20 text-center">
              <div className="bg-emerald-500/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/10">
                <Wallet className="w-9 h-9 text-slate-600" />
              </div>
              <h3 className="text-slate-400 text-xs font-bold">No Income Logged</h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Start adding your earnings statement records to populate this list.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* POPUP MODAL DIALOG CONTAINER */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#050f09] border border-emerald-500/20 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-emerald-500/10">
              <div>
                <h2 className="text-lg font-bold text-white">
                  {editingId ? "Update Income Record" : "Add Income Record"}
                </h2>
                <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider mt-1 block">
                  Post credit transactions to savings accounts
                </span>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-500 hover:text-white p-1 rounded-lg hover:bg-emerald-950/40 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* FORM CONTAINER */}
            <div className="space-y-4">
              
              {/* SOURCE */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 tracking-wide block">
                  Income Source
                </label>
                <input
                  type="text"
                  name="source"
                  placeholder="e.g., Salary Credit, Consulting fee"
                  value={incomeData.source}
                  onChange={handleChange}
                  className="w-full bg-[#07130c] border border-emerald-500/15 focus:border-emerald-500/40 text-white placeholder-slate-600 rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all"
                />
              </div>

              {/* AMOUNT */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 tracking-wide block">
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  placeholder="0.00"
                  value={incomeData.amount}
                  onChange={handleChange}
                  className="w-full bg-[#07130c] border border-emerald-500/15 focus:border-emerald-500/40 text-white placeholder-slate-600 rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all"
                />
              </div>

              {/* CATEGORY */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 tracking-wide block">
                  Category
                </label>
                <select
                  name="category"
                  value={incomeData.category}
                  onChange={handleChange}
                  className="w-full bg-[#07130c] border border-emerald-500/15 focus:border-emerald-500/40 text-white rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all cursor-pointer"
                >
                  <option value="">Select Category</option>
                  <option value="Salary">Salary</option>
                  <option value="Freelancing">Freelancing</option>
                  <option value="Business">Business</option>
                  <option value="Investment">Investment</option>
                  <option value="Rental">Rental</option>
                  <option value="Passive Income">Passive Income</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* DATE */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 tracking-wide block">
                  Credit Date
                </label>
                <input
                  type="date"
                  name="incomeDate"
                  value={incomeData.incomeDate}
                  onChange={handleChange}
                  className="w-full bg-[#07130c] border border-emerald-500/15 focus:border-emerald-500/40 text-white rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all"
                />
              </div>

              {/* ACTIONS SUBMIT */}
              <div className="pt-2">
                <button
                  onClick={editingId ? handleUpdateIncome : handleAddIncome}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-bold py-3.5 rounded-xl text-sm hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  {editingId ? "Update Income Stream" : "Log Income Stream"}
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
