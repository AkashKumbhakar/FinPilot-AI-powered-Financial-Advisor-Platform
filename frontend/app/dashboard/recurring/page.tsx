"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "react-toastify";
import {
  Repeat,
  Plus,
  Calendar,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Wallet,
  Trash2,
  RefreshCcw,
  BadgeCheck,
  Clock3,
  X,
  Notebook
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from "recharts";

interface RecurringData {
  _id: string;
  title: string;
  type: "Income" | "Expense";
  amount: number;
  category: string;
  frequency: "Daily" | "Weekly" | "Monthly" | "Yearly";
  paymentMethod: string;
  startDate: string;
  nextExecutionDate: string;
  lastExecutionDate?: string;
  isActive: boolean;
  notes?: string;
}

export default function RecurringPage() {
  const [recurring, setRecurring] = useState<RecurringData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    type: "Expense",
    amount: "",
    category: "",
    frequency: "Monthly",
    paymentMethod: "UPI",
    startDate: "",
    nextExecutionDate: "",
    notes: "",
  });

  const [enums, setEnums] = useState<{
    types: string[];
    categories: string[];
    frequencies: string[];
    paymentMethods: string[];
  }>({
    types: [],
    categories: [],
    frequencies: [],
    paymentMethods: [],
  });

  // FETCH RECURRING
  const fetchRecurring = async () => {
    try {
      const res = await api.get("/recurring/all");
      setRecurring(res.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load recurring transactions");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Enums
  const fetchEnums = async () => {
    try {
      const res = await api.get("/recurring/enums");
      setEnums(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRecurring();
    fetchEnums();
  }, []);

  // HANDLE INPUT
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ADD RECURRING
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/recurring/create", {
        ...formData,
        amount: Number(formData.amount),
      });

      toast.success("Recurring transaction added");
      setShowModal(false);
      setFormData({
        title: "",
        type: "Expense",
        amount: "",
        category: "",
        frequency: "Monthly",
        paymentMethod: "UPI",
        startDate: "",
        nextExecutionDate: "",
        notes: "",
      });
      fetchRecurring();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add recurring transaction");
    }
  };

  // DELETE
  const deleteRecurring = async (id: string) => {
    try {
      await api.delete(`/recurring/delete/${id}`);
      toast.success("Recurring transaction deleted");
      fetchRecurring();
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  // EXECUTE
  const executeRecurring = async () => {
    try {
      await api.post("/recurring/execute");
      toast.success("Recurring transactions executed");
      fetchRecurring();
    } catch (error) {
      console.error(error);
      toast.error("Execution failed");
    }
  };

  // STATS
  const totalIncome = recurring
    .filter((item) => item.type === "Income")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = recurring
    .filter((item) => item.type === "Expense")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const activeCount = recurring.filter((item) => item.isActive).length;

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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 bg-[#050f09] border border-emerald-500/10 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white leading-none">
            Recurring Transactions
          </h1>
          <p className="text-slate-500 text-xs mt-2 font-medium">
            Manage and schedule automated recurring payments and income streams.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={executeRecurring}
            className="flex items-center gap-2 bg-emerald-950/20 border border-emerald-500/25 hover:border-emerald-500/40 text-emerald-400 text-xs font-bold px-5 py-4 rounded-xl transition"
          >
            <RefreshCcw className="w-4 h-4" /> Execute Scheduled
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-bold px-6 py-4 rounded-xl text-sm hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Recurring
          </button>
        </div>
      </div>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* TOTAL INCOME */}
        <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300 shadow-sm">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl" />
          <div className="flex items-center justify-between mb-6">
            <div className="bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/20">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
              Income
            </span>
          </div>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">
            Recurring Income
          </p>
          <h2 className="text-3xl font-extrabold text-white">
            ₹{totalIncome?.toLocaleString() || "0"}
          </h2>
        </div>

        {/* TOTAL EXPENSE */}
        <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300 shadow-sm">
          <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/5 rounded-full blur-xl" />
          <div className="flex items-center justify-between mb-6">
            <div className="bg-red-500/10 p-3.5 rounded-xl border border-red-500/20">
              <TrendingDown className="w-6 h-6 text-red-400" />
            </div>
            <span className="text-red-400 text-xs font-bold uppercase tracking-wider">
              Expense
            </span>
          </div>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">
            Recurring Expense
          </p>
          <h2 className="text-3xl font-extrabold text-white">
            ₹{totalExpense?.toLocaleString() || "0"}
          </h2>
        </div>

        {/* ACTIVE COUNT */}
        <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300 shadow-sm">
          <div className="absolute top-0 right-0 w-20 h-20 bg-teal-500/5 rounded-full blur-xl" />
          <div className="flex items-center justify-between mb-6">
            <div className="bg-teal-500/10 p-3.5 rounded-xl border border-teal-500/20">
              <BadgeCheck className="w-6 h-6 text-teal-400" />
            </div>
            <span className="text-teal-400 text-xs font-bold uppercase tracking-wider">
              Active
            </span>
          </div>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">
            Active Routines
          </p>
          <h2 className="text-3xl font-extrabold text-white">
            {activeCount}
          </h2>
        </div>

        {/* TOTAL COUNT */}
        <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl p-6 text-black shadow-lg shadow-emerald-500/5 relative overflow-hidden group hover:scale-[1.01] transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-6">
            <div className="bg-black/10 p-3.5 rounded-xl border border-black/5">
              <Repeat className="w-6 h-6" />
            </div>
            <RefreshCcw className="w-5 h-5" />
          </div>
          <p className="font-semibold text-xs uppercase tracking-wider mb-1.5">
            Total Routines
          </p>
          <h2 className="text-4xl font-black">
            {recurring.length}
          </h2>
        </div>

      </div>

      {/* CHART */}
      <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-2xl p-6 hover:border-emerald-500/15 transition duration-300">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-white text-base font-bold">Recurring Analytics</h2>
            <p className="text-slate-500 text-xs mt-1">Automated transaction value distribution</p>
          </div>
          <div className="bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-sm font-semibold">
            Auto Payments
          </div>
        </div>

        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={recurring} margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
              <defs>
                <linearGradient id="recurringGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="title" 
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
                fill="url(#recurringGlow)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RECURRING LEDGER LIST */}
      <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="mb-8 pb-3 border-b border-emerald-500/10">
          <h2 className="text-lg font-bold text-white">Scheduled Tasks</h2>
          <p className="text-slate-500 text-xs mt-1">Review, monitor, and delete active automation cycles</p>
        </div>

        <div className="space-y-4 max-h-[600px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {recurring.map((item) => (
            <div
              key={item._id}
              className="bg-[#07130c]/40 border border-emerald-500/5 hover:border-emerald-500/15 rounded-xl p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-5 transition-all duration-200"
            >
              
              {/* LEFT INFO BLOCK */}
              <div className="flex items-center gap-4">
                <div className={`p-3.5 rounded-xl border shrink-0 ${
                  item.type === "Income" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"
                }`}>
                  {item.type === "Income" ? (
                    <TrendingUp className="w-5.5 h-5.5" />
                  ) : (
                    <TrendingDown className="w-5.5 h-5.5" />
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">
                    {item.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
                    <span className="inline-block text-[9px] font-bold tracking-wider uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
                      {item.category}
                    </span>

                    <span className="h-1 w-1 rounded-full bg-slate-700" />

                    <div className="flex items-center gap-1.5 text-slate-500 font-semibold text-[10px]">
                      <Repeat className="w-3.5 h-3.5" />
                      {item.frequency}
                    </div>

                    <span className="h-1 w-1 rounded-full bg-slate-700" />

                    <div className="flex items-center gap-1.5 text-slate-500 font-semibold text-[10px]">
                      <CreditCard className="w-3.5 h-3.5" />
                      {item.paymentMethod}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 mt-3 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                    <Clock3 className="w-3.5 h-3.5 text-emerald-400/70" />
                    Next: {new Date(item.nextExecutionDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </div>
                </div>
              </div>

              {/* RIGHT ACTIONS BLOCK */}
              <div className="flex items-center justify-between xl:justify-end gap-5 border-t xl:border-t-0 pt-4 xl:pt-0 border-emerald-950/20">
                <div className="text-left xl:text-right">
                  <p className={`text-lg font-extrabold ${item.type === "Income" ? "text-emerald-400" : "text-red-400"}`}>
                    {item.type === "Income" ? "+" : "-"} ₹{item.amount?.toLocaleString()}
                  </p>

                  <div className="flex items-center justify-end gap-1.5 mt-1.5 text-slate-500 text-[10px] font-semibold">
                    <Calendar className="w-3.5 h-3.5" />
                    Started: {new Date(item.startDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </div>
                </div>

                <button
                  onClick={() => deleteRecurring(item._id)}
                  className="bg-red-500/10 hover:bg-red-500/20 p-2.5 rounded-lg border border-red-500/20 transition text-red-400 focus:outline-none"
                  title="Delete Routine"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}

          {recurring.length === 0 && (
            <div className="py-20 text-center">
              <div className="bg-emerald-500/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/10">
                <Wallet className="w-9 h-9 text-slate-600" />
              </div>
              <h3 className="text-slate-400 text-xs font-bold">No Recurring Schedules Found</h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Establish automated schedules to catalog periodic ledger tasks.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* POPUP MODAL DIALOG CONTAINER */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#050f09] border border-emerald-500/20 rounded-2xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            
            {/* HEADER */}
            <div className="flex items-center justify-between mb-8 pb-3 border-b border-emerald-500/10">
              <div>
                <h2 className="text-lg font-bold text-white">Add Recurring Routine</h2>
                <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider block mt-1">
                  Setup automated triggers for ledger credits and debits
                </span>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-500 hover:text-white p-1 rounded-lg hover:bg-emerald-950/40 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* TITLE */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 tracking-wide block">
                    Routine Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g., Monthly Rent payment"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#07130c] border border-emerald-500/15 focus:border-emerald-500/40 text-white placeholder-slate-600 rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all"
                  />
                </div>

                {/* AMOUNT */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 tracking-wide block">
                    Transaction Amount
                  </label>
                  <input
                    type="number"
                    name="amount"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#07130c] border border-emerald-500/15 focus:border-emerald-500/40 text-white placeholder-slate-600 rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all"
                  />
                </div>

                {/* TYPE */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 tracking-wide block">
                    Routine Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full bg-[#07130c] border border-emerald-500/15 focus:border-emerald-500/40 text-white rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all cursor-pointer"
                  >
                    <option value="Expense">Expense</option>
                    <option value="Income">Income</option>
                  </select>
                </div>

                {/* CATEGORY */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 tracking-wide block">
                    Category Group
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-[#07130c] border border-emerald-500/15 focus:border-emerald-500/40 text-white rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all cursor-pointer"
                  >
                    <option value="">Select Category</option>
                    {enums.categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* FREQUENCY */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 tracking-wide block">
                    Interval Frequency
                  </label>
                  <select
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                    className="w-full bg-[#07130c] border border-emerald-500/15 focus:border-emerald-500/40 text-white rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all cursor-pointer"
                  >
                    {enums.frequencies.map((frequency) => (
                      <option key={frequency} value={frequency}>
                        {frequency}
                      </option>
                    ))}
                  </select>
                </div>

                {/* PAYMENT METHOD */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 tracking-wide block">
                    Payment Method
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="w-full bg-[#07130c] border border-emerald-500/15 focus:border-emerald-500/40 text-white rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all cursor-pointer"
                  >
                    {enums.paymentMethods.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>

                {/* START DATE */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 tracking-wide block">
                    Start Execution Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#07130c] border border-emerald-500/15 focus:border-emerald-500/40 text-white rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all"
                  />
                </div>

                {/* NEXT EXECUTION DATE */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 tracking-wide block">
                    Next Execution Date
                  </label>
                  <input
                    type="date"
                    name="nextExecutionDate"
                    value={formData.nextExecutionDate}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#07130c] border border-emerald-500/15 focus:border-emerald-500/40 text-white rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all"
                  />
                </div>

              </div>

              {/* NOTES */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 tracking-wide block">
                  Add Notes / Logs
                </label>
                <textarea
                  name="notes"
                  placeholder="e.g., Landlord bank account: ACC-1829..."
                  rows={2}
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full bg-[#07130c] border border-emerald-500/15 focus:border-emerald-500/40 text-white placeholder-slate-600 rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all resize-none"
                />
              </div>

              {/* ACTIONS SUBMIT */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-bold py-3.5 rounded-xl text-sm hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  Create Automated Routine
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
