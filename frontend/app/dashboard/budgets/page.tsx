"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "react-toastify";
import {
  PiggyBank,
  Wallet,
  Plus,
  Calendar,
  Pencil,
  Trash2,
  Target,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  X,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from "recharts";

interface BudgetData {
  _id: string;
  category: string;
  amount: number;
  month: number;
  year: number;
  createdAt: string;
}

interface TrackingData {
  category: string;
  budget: number;
  spent: number;
  remaining: number;
  status: string;
}

interface BudgetFormData {
  category: string;
  amount: string;
  month: string;
  year: string;
}

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<BudgetData[]>([]);
  const [tracking, setTracking] = useState<TrackingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<BudgetFormData>({
    category: "",
    amount: "",
    month: "",
    year: "",
  });

  // FETCH DATA
  const fetchBudgets = async () => {
    try {
      const [budgetRes, trackingRes] = await Promise.all([
        api.get("/budget/all"),
        api.get("/budget/tracking"),
      ]);

      setBudgets(budgetRes.data.data || []);
      setTracking(trackingRes.data.data || []);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to fetch budgets"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  // HANDLE CHANGE
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // RESET FORM
  const resetForm = () => {
    setFormData({
      category: "",
      amount: "",
      month: "",
      year: "",
    });
    setEditingId(null);
  };

  // OPEN ADD MODAL
  const handleAddBudget = () => {
    resetForm();
    setOpenModal(true);
  };

  // OPEN EDIT MODAL
  const handleEditBudget = (budget: BudgetData) => {
    setEditingId(budget._id);
    setFormData({
      category: budget.category,
      amount: String(budget.amount),
      month: String(budget.month),
      year: String(budget.year),
    });
    setOpenModal(true);
  };

  // SUBMIT FORM
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/budget/update/${editingId}`, formData);
        toast.success("Budget updated successfully");
      } else {
        await api.post("/budget/create", formData);
        toast.success("Budget created successfully");
      }

      setOpenModal(false);
      resetForm();
      fetchBudgets();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  // DELETE BUDGET
  const deleteBudget = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this budget?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/budget/delete/${id}`);
      toast.success("Budget deleted successfully");
      fetchBudgets();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Delete failed"
      );
    }
  };

  // TOTALS
  const totalBudget = budgets.reduce((acc, item) => acc + item.amount, 0);
  const totalSpent = tracking.reduce((acc, item) => acc + item.spent, 0);
  const totalRemaining = tracking.reduce((acc, item) => acc + item.remaining, 0);

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
            Budget Planner
          </h1>
          <p className="text-slate-500 text-xs mt-2 font-medium">
            Plan monthly categories, track credit allocations, and audit savings limits.
          </p>
        </div>

        <button
          onClick={handleAddBudget}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-bold px-6 py-4 rounded-xl text-sm hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Budget
        </button>
      </div>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* TOTAL BUDGET */}
        <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300 shadow-sm">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl" />
          <div className="flex items-center justify-between mb-6">
            <div className="bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/20">
              <PiggyBank className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
              Planned
            </span>
          </div>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">
            Total Budget
          </p>
          <h2 className="text-3xl font-extrabold text-white">
            ₹{totalBudget?.toLocaleString() || "0"}
          </h2>
        </div>

        {/* TOTAL SPENT */}
        <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300 shadow-sm">
          <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/5 rounded-full blur-xl" />
          <div className="flex items-center justify-between mb-6">
            <div className="bg-red-500/10 p-3.5 rounded-xl border border-red-500/20">
              <TrendingUp className="w-6 h-6 text-red-400" />
            </div>
            <span className="text-red-400 text-xs font-bold uppercase tracking-wider">
              Spent
            </span>
          </div>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">
            Total Spent
          </p>
          <h2 className="text-3xl font-extrabold text-white">
            ₹{totalSpent?.toLocaleString() || "0"}
          </h2>
        </div>

        {/* REMAINING */}
        <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl p-6 text-black shadow-lg shadow-emerald-500/5 relative overflow-hidden group hover:scale-[1.01] transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-6">
            <div className="bg-black/10 p-3.5 rounded-xl border border-black/5">
              <Wallet className="w-6 h-6" />
            </div>
            <Target className="w-6 h-6" />
          </div>
          <p className="font-semibold text-xs uppercase tracking-wider mb-1.5">
            Remaining Budget
          </p>
          <h2 className="text-4xl font-black">
            ₹{totalRemaining?.toLocaleString() || "0"}
          </h2>
        </div>

      </div>

      {/* CHART */}
      <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-2xl p-6 hover:border-emerald-500/15 transition duration-300">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-white text-base font-bold">Budget Analytics</h2>
            <p className="text-slate-500 text-xs mt-1">Monthly category planned limits</p>
          </div>
          <div className="bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-sm font-semibold">
            Budget Trends
          </div>
        </div>

        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={budgets} margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
              <defs>
                <linearGradient id="budgetGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="category" 
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
                fill="url(#budgetGlow)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* BUDGET TRACKING LIMIT PROGRESS LIST */}
      <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="mb-8 pb-3 border-b border-emerald-500/10">
          <h2 className="text-lg font-bold text-white">Budget Tracking</h2>
          <p className="text-slate-500 text-xs mt-1">Real-time spend reconciliation against category thresholds</p>
        </div>

        <div className="space-y-4 max-h-[600px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {tracking.map((item, index) => {
            const percentage = (item.spent / item.budget) * 100;

            return (
              <div
                key={index}
                className="bg-[#07130c]/40 border border-emerald-500/5 hover:border-emerald-500/15 rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all duration-200"
              >
                
                {/* LEFT INFO BLOCK */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3.5 mb-3">
                    <div className={`p-2.5 rounded-xl border ${
                      item.status === "Safe" 
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                        : "bg-red-500/10 border-red-500/20 text-red-400"
                    }`}>
                      {item.status === "Safe" ? (
                        <ShieldCheck className="w-5 h-5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white leading-none">
                        {item.category}
                      </h3>
                      <span className={`text-[9px] font-bold uppercase tracking-widest block mt-1 ${
                        item.status === "Safe" ? "text-emerald-400" : "text-red-400"
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>

                  {/* PROGRESS BAR */}
                  <div className="w-full lg:max-w-[420px] bg-slate-800/80 h-2.5 rounded-full overflow-hidden border border-slate-700/50">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        percentage >= 90 ? "bg-red-500" : "bg-emerald-400"
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>

                {/* RIGHT ACCOUNT DETAILS GRID */}
                <div className="grid grid-cols-3 gap-6 text-left lg:text-right shrink-0">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide block mb-1">
                      Limit
                    </span>
                    <h4 className="text-sm font-extrabold text-white">
                      ₹{item.budget?.toLocaleString()}
                    </h4>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide block mb-1">
                      Spent
                    </span>
                    <h4 className="text-sm font-extrabold text-red-400">
                      ₹{item.spent?.toLocaleString()}
                    </h4>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide block mb-1">
                      Balance
                    </span>
                    <h4 className={`text-sm font-extrabold ${item.remaining < 0 ? "text-red-400" : "text-emerald-400"}`}>
                      ₹{item.remaining?.toLocaleString()}
                    </h4>
                  </div>
                </div>

              </div>
            );
          })}

          {tracking.length === 0 && (
            <div className="py-20 text-center">
              <div className="bg-emerald-500/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/10">
                <PiggyBank className="w-9 h-9 text-slate-600" />
              </div>
              <h3 className="text-slate-400 text-xs font-bold">No Budget Tracking Found</h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Active statement analysis will generate records as budgets are set.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ALL CREATED BUDGETS HISTORY */}
      <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="mb-8 pb-3 border-b border-emerald-500/10">
          <h2 className="text-lg font-bold text-white">All Active Budgets</h2>
          <p className="text-slate-500 text-xs mt-1">Review and manage your custom thresholds</p>
        </div>

        <div className="space-y-4 max-h-[600px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {budgets.map((item) => (
            <div
              key={item._id}
              className="bg-[#07130c]/40 border border-emerald-500/5 hover:border-emerald-500/15 rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5 transition-all duration-200"
            >
              
              {/* LEFT INFO BLOCK */}
              <div className="flex items-center gap-4">
                <div className="bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/20 shrink-0">
                  <PiggyBank className="w-5.5 h-5.5 text-emerald-400" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">
                    {item.category}
                  </h3>

                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="inline-block text-[9px] font-bold tracking-wider uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
                      Budget Category
                    </span>

                    <span className="h-1 w-1 rounded-full bg-slate-700" />

                    <div className="flex items-center gap-1 text-slate-500 text-[10px] font-semibold">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.month}/{item.year}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT ACTIONS BLOCK */}
              <div className="flex items-center justify-between lg:justify-end gap-5 border-t lg:border-t-0 pt-4 lg:pt-0 border-emerald-950/20">
                <div className="text-left lg:text-right">
                  <p className="text-lg font-extrabold text-emerald-400">
                    ₹{item.amount?.toLocaleString()}
                  </p>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mt-0.5">
                    Planned Limit
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditBudget(item)}
                    className="bg-emerald-500/10 hover:bg-emerald-500/20 p-2.5 rounded-lg border border-emerald-500/20 transition text-emerald-400 focus:outline-none"
                    title="Edit Budget Limit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => deleteBudget(item._id)}
                    className="bg-red-500/10 hover:bg-red-500/20 p-2.5 rounded-lg border border-red-500/20 transition text-red-400 focus:outline-none"
                    title="Delete Budget Limit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* POPUP MODAL DIALOG CONTAINER */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#050f09] border border-emerald-500/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            
            {/* HEADER */}
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-emerald-500/10">
              <div>
                <h2 className="text-lg font-bold text-white">
                  {editingId ? "Update Budget Limit" : "Create Budget Limit"}
                </h2>
                <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider mt-1 block">
                  Define threshold triggers for ledger items
                </span>
              </div>
              <button
                onClick={() => setOpenModal(false)}
                className="text-slate-500 hover:text-white p-1 rounded-lg hover:bg-emerald-950/40 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* FORM CONTAINER */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* CATEGORY */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 tracking-wide block">
                  Category Group
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#07130c] border border-emerald-500/15 focus:border-emerald-500/40 text-white rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all cursor-pointer"
                >
                  <option value="">Select Category</option>
                  <option value="Food">Food</option>
                  <option value="Travel">Travel</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Bills">Bills</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Health">Health</option>
                  <option value="Education">Education</option>
                  <option value="Investment">Investment</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* AMOUNT */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 tracking-wide block">
                  Budget Amount Limit
                </label>
                <input
                  type="number"
                  name="amount"
                  placeholder="Enter budget limit"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#07130c] border border-emerald-500/15 focus:border-emerald-500/40 text-white placeholder-slate-600 rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all"
                />
              </div>

              {/* MONTH & YEAR */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 tracking-wide block">
                    Month
                  </label>
                  <input
                    type="number"
                    name="month"
                    placeholder="MM"
                    min={1}
                    max={12}
                    value={formData.month}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#07130c] border border-emerald-500/15 focus:border-emerald-500/40 text-white rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 tracking-wide block">
                    Year
                  </label>
                  <input
                    type="number"
                    name="year"
                    placeholder="YYYY"
                    value={formData.year}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#07130c] border border-emerald-500/15 focus:border-emerald-500/40 text-white rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all"
                  />
                </div>
              </div>

              {/* ACTIONS SUBMIT */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-bold py-3.5 rounded-xl text-sm hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  {editingId ? "Update Budget Target" : "Create Budget Target"}
                  <Plus className="w-4 h-4" />
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
