"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/axios";
import { toast } from "react-toastify";
import {
  Goal,
  Plus,
  Trash2,
  Wallet,
  Target,
  CalendarDays,
  PiggyBank,
  TrendingUp,
  CheckCircle2,
  X,
  Sparkles
} from "lucide-react";

interface GoalType {
  _id: string;
  title: string;
  targetAmount: number;
  savedAmount: number;
  deadline: string;
  category: string;
  status: string;
  createdAt: string;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<GoalType[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [savingAmount, setSavingAmount] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    targetAmount: "",
    savedAmount: "",
    deadline: "",
    category: "Other",
  });

  // FETCH GOALS
  const fetchGoals = async () => {
    try {
      const res = await api.get("/goal/all");
      setGoals(res.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch goals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // CREATE GOAL
  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreating(true);
      const res = await api.post("/goal/create", {
        ...formData,
        targetAmount: Number(formData.targetAmount),
        savedAmount: Number(formData.savedAmount),
      });

      toast.success(res.data.message || "Goal created");
      setGoals([res.data.data, ...goals]);
      setFormData({
        title: "",
        targetAmount: "",
        savedAmount: "",
        deadline: "",
        category: "Other",
      });
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to create goal"
      );
    } finally {
      setCreating(false);
    }
  };

  // DELETE GOAL
  const handleDeleteGoal = async (id: string) => {
    const confirmDelete = window.confirm("Delete this goal?");
    if (!confirmDelete) return;

    try {
      const res = await api.delete(`/goal/delete/${id}`);
      toast.success(res.data.message || "Goal deleted");
      setGoals(goals.filter((goal) => goal._id !== id));
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to delete goal"
      );
    }
  };

  // ADD SAVING
  const handleAddSaving = async () => {
    if (!selectedGoal) return;

    try {
      setSaving(true);
      const res = await api.put(`/goal/add-saving/${selectedGoal}`, {
        amount: Number(savingAmount),
      });

      toast.success(res.data.message || "Savings added");
      setGoals(
        goals.map((goal) =>
          goal._id === selectedGoal ? res.data.data : goal
        )
      );
      setSavingAmount("");
      setShowModal(false);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to add saving"
      );
    } finally {
      setSaving(false);
    }
  };

  // TOTALS
  const totalTarget = useMemo(
    () => goals.reduce((acc, item) => acc + item.targetAmount, 0),
    [goals]
  );

  const totalSaved = useMemo(
    () => goals.reduce((acc, item) => acc + item.savedAmount, 0),
    [goals]
  );

  const completedGoals = goals.filter(
    (goal) => goal.status === "Completed"
  ).length;

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#030805]">
        <div className="h-14 w-14 border-b-2 border-emerald-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-[#E2E8F0] font-sans">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 bg-[#050f09] border border-emerald-500/10 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white leading-none">
            Financial Goals
          </h1>
          <p className="text-slate-500 text-xs mt-2 font-medium">
            Define savings thresholds, track targets, and monitor completed milestones.
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-400 to-teal-500 text-black font-bold px-6 py-4 rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/5">
          <Goal className="w-4 h-4" /> Goal Planner
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* TOTAL GOALS */}
        <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300 shadow-sm">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">
                Total Goals
              </p>
              <h2 className="text-3xl font-extrabold text-white">
                {goals.length}
              </h2>
            </div>
            <div className="bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/20">
              <Target className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* TOTAL SAVED */}
        <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300 shadow-sm">
          <div className="absolute top-0 right-0 w-20 h-20 bg-teal-500/5 rounded-full blur-xl" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">
                Total Savings
              </p>
              <h2 className="text-3xl font-extrabold text-white">
                ₹{totalSaved?.toLocaleString() || "0"}
              </h2>
            </div>
            <div className="bg-teal-500/10 p-3.5 rounded-xl border border-teal-500/20">
              <Wallet className="w-5 h-5 text-teal-400" />
            </div>
          </div>
        </div>

        {/* COMPLETED GOALS */}
        <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300 shadow-sm">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">
                Completed
              </p>
              <h2 className="text-3xl font-extrabold text-white">
                {completedGoals}
              </h2>
            </div>
            <div className="bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
        </div>

      </div>

      {/* CREATE GOAL */}
      <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-3.5 mb-8 pb-3 border-b border-emerald-500/10">
          <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
            <Plus className="w-5.5 h-5.5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white leading-none">
              Create New Goal
            </h2>
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block mt-1">
              Start planning your future savings milestones
            </span>
          </div>
        </div>

        <form onSubmit={handleCreateGoal} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <input
            type="text"
            required
            placeholder="Goal Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="bg-[#07130c] border border-emerald-500/15 focus:border-emerald-500/40 text-white placeholder-slate-600 rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all"
          />

          <input
            type="number"
            required
            placeholder="Target Amount"
            value={formData.targetAmount}
            onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
            className="bg-[#07130c] border border-emerald-500/15 focus:border-emerald-500/40 text-white placeholder-slate-600 rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all"
          />

          <input
            type="number"
            placeholder="Initial Saving"
            value={formData.savedAmount}
            onChange={(e) => setFormData({ ...formData, savedAmount: e.target.value })}
            className="bg-[#07130c] border border-emerald-500/15 focus:border-emerald-500/40 text-white placeholder-slate-600 rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all"
          />

          <input
            type="date"
            required
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            className="bg-[#07130c] border border-emerald-500/15 focus:border-emerald-500/40 text-white rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all"
          />

          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="bg-[#07130c] border border-emerald-500/15 focus:border-emerald-500/40 text-white rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all cursor-pointer"
          >
            <option value="Travel">Travel</option>
            <option value="Investment">Investment</option>
            <option value="Emergency">Emergency</option>
            <option value="Vehicle">Vehicle</option>
            <option value="Education">Education</option>
            <option value="Home">Home</option>
            <option value="Other">Other</option>
          </select>

          <button
            type="submit"
            disabled={creating}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-bold px-6 py-3.5 rounded-xl text-sm hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center"
          >
            {creating ? (
              <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              "Create Goal"
            )}
          </button>
        </form>
      </div>

      {/* GOALS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {goals.map((goal) => {
          const progress = (goal.savedAmount / goal.targetAmount) * 100;
          const remaining = goal.targetAmount - goal.savedAmount;

          return (
            <div
              key={goal._id}
              className="bg-[#050f09]/60 border border-emerald-500/10 rounded-2xl p-6 hover:border-emerald-500/15 transition-all duration-300 relative overflow-hidden group shadow-sm flex flex-col justify-between"
            >
              
              {/* GOAL CARD HEADER */}
              <div>
                <div className="flex items-start justify-between mb-6 pb-2 border-b border-emerald-500/5">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                      <PiggyBank className="w-5.5 h-5.5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white leading-none">
                        {goal.title}
                      </h3>
                      <span className="inline-block text-[9px] font-bold tracking-wider uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded mt-1.5">
                        {goal.category}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteGoal(goal._id)}
                    className="bg-red-500/10 hover:bg-red-500/20 p-2.5 rounded-lg border border-red-500/20 transition text-red-400 focus:outline-none"
                    title="Delete Goal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* PROGRESS METERS */}
                <div className="mb-5 space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">Progress</span>
                    <span className="text-emerald-400 font-bold">{progress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-slate-800/80 h-3 rounded-full overflow-hidden border border-slate-700/50">
                    <div
                      style={{ width: `${Math.min(progress, 100)}%` }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                    />
                  </div>
                </div>

                {/* DETAILS METRICS GRID */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="bg-[#07130c]/60 rounded-xl p-4 border border-emerald-500/5">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide block mb-1">
                      Saved
                    </span>
                    <h4 className="text-base font-extrabold text-white">
                      ₹{goal.savedAmount?.toLocaleString()}
                    </h4>
                  </div>

                  <div className="bg-[#07130c]/60 rounded-xl p-4 border border-emerald-500/5">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide block mb-1">
                      Remaining
                    </span>
                    <h4 className="text-base font-extrabold text-emerald-400">
                      ₹{remaining < 0 ? "0" : remaining?.toLocaleString()}
                    </h4>
                  </div>
                </div>
              </div>

              {/* CARD FOOTER INFO & ACTION */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <CalendarDays className="w-4.5 h-4.5 text-slate-500" />
                    Target: {new Date(goal.deadline).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </div>

                  <span className={`inline-block text-[9px] font-black tracking-widest uppercase border px-2.5 py-0.5 rounded-full ${
                    goal.status === "Completed"
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                  }`}>
                    {goal.status}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setSelectedGoal(goal._id);
                    setShowModal(true);
                  }}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-bold py-3.5 rounded-xl text-xs hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/5 hover:shadow-emerald-500/20 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <TrendingUp className="w-4 h-4" /> Add Savings
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* EMPTY GOALS STATE */}
      {goals.length === 0 && (
        <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-2xl p-14 text-center mt-8">
          <div className="bg-emerald-500/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/10">
            <Goal className="w-9 h-9 text-emerald-400" />
          </div>
          <h2 className="text-slate-400 text-xs font-bold">No Goals Found</h2>
          <p className="text-[11px] text-slate-500 mt-1">
            Start planning your future target deposits and wealth milestones.
          </p>
        </div>
      )}

      {/* POPUP MODAL DIALOG CONTAINER */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#050f09] border border-emerald-500/20 rounded-2xl p-6 w-full max-w-md shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            
            {/* HEADER */}
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-emerald-500/10">
              <div>
                <h2 className="text-lg font-bold text-white">Add Saving</h2>
                <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider mt-1 block">
                  Add target deposits to savings goals
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
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 tracking-wide block">
                  Deposit Amount
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={savingAmount}
                  onChange={(e) => setSavingAmount(e.target.value)}
                  className="w-full bg-[#07130c] border border-emerald-500/15 focus:border-emerald-500/40 text-white placeholder-slate-600 rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all"
                />
              </div>

              <button
                onClick={handleAddSaving}
                disabled={saving}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-bold py-3.5 rounded-xl text-sm hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center"
              >
                {saving ? (
                  <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Add Saving"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
