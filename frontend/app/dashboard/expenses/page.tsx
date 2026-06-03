"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
  Plus,
  Trash2,
  Pencil,
  IndianRupee,
  Calendar,
  Wallet,
  Receipt,
  TrendingDown,
  RefreshCcw,
  Tag,
  CreditCard,
  Notebook
} from "lucide-react";

interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: string;
  paymentMethod: string;
  notes?: string;
  expenseDate: string;
  isRecurring: boolean;
  recurringType?: string | null;
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "Food",
    paymentMethod: "Cash",
    notes: "",
    expenseDate: "",
    isRecurring: false,
    recurringType: "",
  });

  // FETCH ALL EXPENSES
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/expense/all");
      setExpenses(res.data.data || []);
    } catch (error) {
      console.error("Error fetching expenses ledger:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // HANDLE INPUT
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  // CREATE / UPDATE
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        amount: Number(formData.amount),
        recurringType: formData.isRecurring ? formData.recurringType : null,
      };

      if (editingId) {
        await api.put(`/expense/update/${editingId}`, payload);
      } else {
        await api.post("/expense/create", payload);
      }

      setFormData({
        title: "",
        amount: "",
        category: "Food",
        paymentMethod: "Cash",
        notes: "",
        expenseDate: "",
        isRecurring: false,
        recurringType: "",
      });
      setEditingId(null);
      fetchExpenses();
    } catch (error) {
      console.error("Error submitting expense record:", error);
    }
  };

  // DELETE
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/expense/delete/${id}`);
      fetchExpenses();
    } catch (error) {
      console.error("Error deleting expense transaction:", error);
    }
  };

  // EDIT
  const handleEdit = (expense: Expense) => {
    setEditingId(expense._id);
    setFormData({
      title: expense.title,
      amount: expense.amount.toString(),
      category: expense.category,
      paymentMethod: expense.paymentMethod,
      notes: expense.notes || "",
      expenseDate: expense.expenseDate.split("T")[0],
      isRecurring: expense.isRecurring,
      recurringType: expense.recurringType || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // TOTAL
  const totalExpense = expenses.reduce((acc, item) => acc + item.amount, 0);

  return (
    <div className="space-y-6 text-[#E2E8F0] font-sans">
      
      {/* HEADER WITH SUMMARY HERO BANNER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 bg-[#050f09] border border-emerald-500/10 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white leading-none">
            Expense Manager
          </h1>
          <p className="text-slate-500 text-xs mt-2 font-medium">
            Monitor, categorize, and organize your ledger records with AI audits.
          </p>
        </div>

        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl flex flex-col justify-center min-w-[200px]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-red-400/80">
            Total Aggregate Spent
          </p>
          <h2 className="text-2xl font-black mt-1">
            ₹{totalExpense.toLocaleString()}
          </h2>
        </div>
      </div>

      {/* TOP METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* TOTAL TRANSACTIONS */}
        <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-2xl p-6 hover:border-emerald-500/20 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">
                Total Transactions
              </p>
              <h2 className="text-3xl font-extrabold text-white">
                {expenses.length}
              </h2>
            </div>
            <div className="bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/20">
              <Receipt className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* HIGHEST EXPENSE */}
        <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-2xl p-6 hover:border-emerald-500/20 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 rounded-full blur-xl" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">
                Highest Expense
              </p>
              <h2 className="text-3xl font-extrabold text-white">
                ₹{(expenses.length > 0 ? Math.max(...expenses.map((e) => e.amount)) : 0).toLocaleString()}
              </h2>
            </div>
            <div className="bg-red-500/10 p-3.5 rounded-xl border border-red-500/20">
              <TrendingDown className="w-5 h-5 text-red-400" />
            </div>
          </div>
        </div>

        {/* CATEGORIES COUNT */}
        <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-2xl p-6 hover:border-emerald-500/20 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-teal-500/5 rounded-full blur-xl" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">
                Unique Categories
              </p>
              <h2 className="text-3xl font-extrabold text-white">
                {new Set(expenses.map((e) => e.category)).size}
              </h2>
            </div>
            <div className="bg-teal-500/10 p-3.5 rounded-xl border border-teal-500/20">
              <Wallet className="w-5 h-5 text-teal-400" />
            </div>
          </div>
        </div>

        {/* RECURRING STATS */}
        <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-2xl p-6 hover:border-emerald-500/20 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">
                Recurring Items
              </p>
              <h2 className="text-3xl font-extrabold text-white">
                {expenses.filter((e) => e.isRecurring).length}
              </h2>
            </div>
            <div className="bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/20">
              <RefreshCcw className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
        </div>

      </div>

      {/* FORM: CREATE / UPDATE */}
      <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-3.5 mb-8 pb-3 border-b border-emerald-500/10">
          <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
            <Plus className="w-5.5 h-5.5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white leading-none">
              {editingId ? "Update Transaction Record" : "Add Transaction Record"}
            </h2>
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block mt-1">
              Add income outflows or savings allocations
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          
          {/* TITLE */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 tracking-wide block">
              Expense Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Grocery Store checkout"
              className="w-full bg-[#07130c] border border-emerald-500/15 focus:border-emerald-500/40 text-white placeholder-slate-600 rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all"
            />
          </div>

          {/* AMOUNT */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 tracking-wide block">
              Amount
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <IndianRupee className="w-4.5 h-4.5" />
              </div>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                placeholder="0.00"
                className="w-full bg-[#07130c] border border-emerald-500/15 focus:border-emerald-500/40 text-white placeholder-slate-600 rounded-xl py-3.5 pl-11 pr-5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all"
              />
            </div>
          </div>

          {/* CATEGORY */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 tracking-wide block">
              Category Group
            </label>
            <div className="relative">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-[#07130c] border border-emerald-500/15 focus:border-emerald-500/40 text-white rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all appearance-none cursor-pointer"
              >
                <option value="Food">Food</option>
                <option value="Rent">Rent</option>
                <option value="Transport">Transport</option>
                <option value="Shopping">Shopping</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Bills">Bills</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Travel">Travel</option>
                <option value="Investment">Investment</option>
                <option value="Other">Other</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500">
                <Tag className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* PAYMENT METHOD */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 tracking-wide block">
              Payment Method
            </label>
            <div className="relative">
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full bg-[#07130c] border border-emerald-500/15 focus:border-emerald-500/40 text-white rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all appearance-none cursor-pointer"
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Net Banking">Net Banking</option>
                <option value="Wallet">Wallet</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* RECURRING SWITCH */}
          <div className="md:col-span-2 bg-[#07130c]/50 border border-emerald-500/10 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Recurring Ledger Item</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Automate database allocations if this transaction repeats periodically.
                </p>
              </div>
              <input
                type="checkbox"
                name="isRecurring"
                checked={formData.isRecurring}
                onChange={handleChange}
                className="w-5.5 h-5.5 rounded border-emerald-500/20 bg-[#050f09] text-emerald-500 focus:ring-emerald-500/30 cursor-pointer"
              />
            </div>

            {formData.isRecurring && (
              <div className="space-y-1.5 animate-fadeIn">
                <label className="text-xs font-semibold text-slate-300 tracking-wide block">
                  Recurring Period
                </label>
                <select
                  name="recurringType"
                  value={formData.recurringType}
                  onChange={handleChange}
                  className="w-full bg-[#050f09] border border-emerald-500/15 focus:border-emerald-500/40 text-white rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all"
                >
                  <option value="">Select Type</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
            )}
          </div>

          {/* DATE */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 tracking-wide block">
              Expense Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <Calendar className="w-4.5 h-4.5" />
              </div>
              <input
                type="date"
                name="expenseDate"
                value={formData.expenseDate}
                onChange={handleChange}
                required
                className="w-full bg-[#07130c] border border-emerald-500/15 focus:border-emerald-500/40 text-white rounded-xl py-3.5 pl-11 pr-5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all"
              />
            </div>
          </div>

          {/* NOTES */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 tracking-wide block">
              Expense Notes / Logs
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 pt-3.5 pointer-events-none text-slate-500">
                <Notebook className="w-4.5 h-4.5" />
              </div>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={1}
                placeholder="Optional descriptions or tags..."
                className="w-full bg-[#07130c] border border-emerald-500/15 focus:border-emerald-500/40 text-white placeholder-slate-600 rounded-xl py-3.5 pl-11 pr-5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all resize-none"
              />
            </div>
          </div>

          {/* BUTTON SUBMIT */}
          <div className="md:col-span-2 pt-2">
            <button
              type="submit"
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-bold px-8 py-3.5 rounded-xl text-sm hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              {editingId ? "Update Transaction" : "Log New Transaction"}
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* EXPENSE LEDGER HISTORY */}
      <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="mb-8 pb-3 border-b border-emerald-500/10">
          <h2 className="text-lg font-bold text-white">Expense Ledger Logs</h2>
          <p className="text-slate-500 text-xs mt-1">Review, edit, and delete all historical entries</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500 font-medium text-xs">
            <div className="h-6 w-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Syncing account statements...
          </div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-16 text-slate-500 font-medium text-xs">
            <Receipt className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            No logged expenses found on this account.
          </div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {expenses.map((expense) => (
              <div
                key={expense._id}
                className="bg-[#07130c]/40 border border-emerald-500/5 hover:border-emerald-500/15 rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5 transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/20 shrink-0">
                    <Receipt className="w-5 h-5 text-red-400" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {expense.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <span className="inline-block text-[9px] font-bold tracking-wider uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
                        {expense.category}
                      </span>

                      {expense.isRecurring && (
                        <span className="inline-block text-[9px] font-bold tracking-wider uppercase bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2 py-0.5 rounded flex items-center gap-1">
                          <RefreshCcw className="w-2.5 h-2.5" />
                          {expense.recurringType}
                        </span>
                      )}

                      <span className="text-[10px] font-bold text-slate-500 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded">
                        {expense.paymentMethod}
                      </span>

                      <span className="text-[10px] text-slate-500 font-semibold">
                        {new Date(expense.expenseDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </span>
                    </div>

                    {expense.notes && (
                      <p className="text-slate-400 mt-2 text-xs leading-relaxed max-w-xl">
                        {expense.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-5 border-t lg:border-t-0 pt-4 lg:pt-0 border-emerald-950/20">
                  <h2 className="text-xl font-extrabold text-red-400">
                    - ₹{expense.amount.toLocaleString()}
                  </h2>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(expense)}
                      className="bg-emerald-500/10 hover:bg-emerald-500/20 p-2.5 rounded-lg border border-emerald-500/20 transition text-emerald-400 focus:outline-none"
                      title="Edit Transaction"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(expense._id)}
                      className="bg-red-500/10 hover:bg-red-500/20 p-2.5 rounded-lg border border-red-500/20 transition text-red-400 focus:outline-none"
                      title="Delete Transaction"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
