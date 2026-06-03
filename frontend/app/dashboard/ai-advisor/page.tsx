"use client";

import { useEffect, useRef, useState } from "react";
import api from "@/lib/axios";
import { toast } from "react-toastify";
import {
  Brain,
  Send,
  Sparkles,
  TrendingUp,
  PiggyBank,
  TriangleAlert,
  Wallet,
  Bot,
  User,
  Loader2,
  X,
  ArrowRight
} from "lucide-react";

interface SpendingAnalysis {
  totalExpense: number;
  totalIncome: number;
  savings: number;
  expenseRatio: string;
  status: string;
}

interface PredictionData {
  predictedExpense: number;
  predictedSavings: number;
  status: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function AiAdvisorPage() {
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [insights, setInsights] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<SpendingAnalysis | null>(null);
  const [tips, setTips] = useState<string[]>([]);
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello 👋 I am your AI Financial Advisor. Ask me anything about budgeting, saving, investments, SIPs or expense management.",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // AUTO SCROLL
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // FETCH AI DATA
  const fetchAiData = async () => {
    try {
      const [
        insightsRes,
        analysisRes,
        tipsRes,
        predictionRes,
      ] = await Promise.all([
        api.get("/ai/insights"),
        api.get("/ai/spending-analysis"),
        api.get("/ai/savings-tips"),
        api.get("/ai/monthly-prediction"),
      ]);

      setInsights(insightsRes.data.insights || []);
      setAnalysis(analysisRes.data);
      setTips(tipsRes.data.tips || []);
      setPrediction(predictionRes.data);
    } catch (error: any) {
      console.error("Error fetching advisor insights:", error);
      toast.error("Failed to load AI data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAiData();
  }, []);

  // SEND CHAT MESSAGE
  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      role: "user" as const,
      content: message,
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentMessage = message;
    setMessage("");

    try {
      setChatLoading(true);
      const res = await api.post("/ai/chat", {
        message: currentMessage,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.data.reply,
        },
      ]);
    } catch (error: any) {
      console.error("Error querying chat completion:", error);
      toast.error(
        error.response?.data?.message || "AI failed to respond"
      );
    } finally {
      setChatLoading(false);
    }
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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 bg-[#050f09] border border-emerald-500/10 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/20 shrink-0">
            <Brain className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white leading-none">
              AI Financial Advisor
            </h1>
            <p className="text-slate-500 text-xs mt-2 font-medium">
              Autonomous wealth calculations, predictive models, and chat guidance.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-400 to-teal-500 text-black font-bold px-6 py-4 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/5">
          <Sparkles className="w-4 h-4" /> AI Powered Insights
        </div>
      </div>

      {/* TOP ANALYTICS METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* TOTAL INCOME */}
        <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300 shadow-sm">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">
                Total Income
              </p>
              <h2 className="text-3xl font-extrabold text-white">
                ₹{analysis?.totalIncome?.toLocaleString() || "0"}
              </h2>
            </div>
            <div className="bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/20">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* TOTAL EXPENSE */}
        <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300 shadow-sm">
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 rounded-full blur-xl" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">
                Total Expense
              </p>
              <h2 className="text-3xl font-extrabold text-white">
                ₹{analysis?.totalExpense?.toLocaleString() || "0"}
              </h2>
            </div>
            <div className="bg-red-500/10 p-3.5 rounded-xl border border-red-500/20">
              <Wallet className="w-5 h-5 text-red-400" />
            </div>
          </div>
        </div>

        {/* SAVINGS */}
        <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300 shadow-sm">
          <div className="absolute top-0 right-0 w-16 h-16 bg-teal-500/5 rounded-full blur-xl" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">
                Savings
              </p>
              <h2 className="text-3xl font-extrabold text-teal-400">
                ₹{analysis?.savings?.toLocaleString() || "0"}
              </h2>
            </div>
            <div className="bg-teal-500/10 p-3.5 rounded-xl border border-teal-500/20">
              <PiggyBank className="w-5 h-5 text-teal-400" />
            </div>
          </div>
        </div>

        {/* PREDICTION STATUS */}
        <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300 shadow-sm">
          <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/5 rounded-full blur-xl" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">
                Prediction Status
              </p>
              <h2 className="text-xl font-extrabold text-yellow-400 tracking-tight">
                {prediction?.status || "Analyzing"}
              </h2>
            </div>
            <div className="bg-yellow-500/10 p-3.5 rounded-xl border border-yellow-500/20">
              <TriangleAlert className="w-5 h-5 text-yellow-400" />
            </div>
          </div>
        </div>

      </div>

      {/* INSIGHTS + TIPS GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* INSIGHTS PANEL */}
        <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-2xl p-6 hover:border-emerald-500/15 transition duration-300">
          <div className="flex items-center gap-3 mb-6 pb-2 border-b border-emerald-500/10">
            <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
              <Brain className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-none">AI Insights</h2>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-1 block">Smart cash flow assessments</span>
            </div>
          </div>

          <div className="space-y-4 max-h-[360px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {insights.map((insight, index) => (
              <div
                key={index}
                className="bg-[#07130c]/40 border border-emerald-500/5 hover:border-emerald-500/15 rounded-xl p-4.5 transition-all duration-200"
              >
                <p className="text-slate-300 text-xs leading-relaxed">
                  {insight}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* SAVINGS TIPS PANEL */}
        <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-2xl p-6 hover:border-emerald-500/15 transition duration-300">
          <div className="flex items-center gap-3 mb-6 pb-2 border-b border-emerald-500/10">
            <div className="bg-teal-500/10 p-2.5 rounded-xl border border-teal-500/20">
              <PiggyBank className="w-5.5 h-5.5 text-teal-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-none">Savings Tips</h2>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-1 block">Custom saving strategies</span>
            </div>
          </div>

          <div className="space-y-4 max-h-[360px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {tips.map((tip, index) => (
              <div
                key={index}
                className="bg-[#07130c]/40 border border-emerald-500/5 hover:border-emerald-500/15 rounded-xl p-4.5 transition-all duration-200"
              >
                <p className="text-slate-300 text-xs leading-relaxed">
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* AI CHAT CONSOLE */}
      <div className="bg-[#050f09]/60 border border-emerald-500/10 rounded-2xl overflow-hidden shadow-md">
        
        {/* CHAT HEADER */}
        <div className="border-b border-emerald-500/10 p-5 flex items-center gap-4 bg-[#08150d]/50">
          <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
            <Bot className="w-5.5 h-5.5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white leading-none">
              AI Chat Assistant
            </h2>
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block mt-1">
              Consult advisor on budgets, savings pools, or indexes
            </span>
          </div>
        </div>

        {/* CHAT CHRONOLOGICAL SCREEN */}
        <div className="h-[460px] overflow-y-auto p-6 space-y-5 bg-[#030805]/40 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
                  max-w-[75%]
                  rounded-2xl
                  px-4.5 py-3
                  flex gap-3
                  text-xs
                  leading-relaxed
                  ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-semibold rounded-tr-none shadow-md shadow-emerald-500/5"
                      : "bg-[#07130c]/80 border border-emerald-500/15 text-slate-200 rounded-tl-none shadow-sm"
                  }
                `}
              >
                <div className="shrink-0">
                  {msg.role === "user" ? (
                    <User className="w-4 h-4 mt-0.5 text-black" />
                  ) : (
                    <Bot className="w-4 h-4 mt-0.5 text-emerald-400" />
                  )}
                </div>
                <p>{msg.content}</p>
              </div>
            </div>
          ))}

          {chatLoading && (
            <div className="flex justify-start">
              <div className="bg-[#07130c]/80 border border-emerald-500/15 rounded-2xl rounded-tl-none px-4.5 py-3 flex items-center gap-2.5 text-xs text-slate-400 shadow-sm">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                AI is auditing statements...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* CHAT PANEL INPUT */}
        <div className="border-t border-emerald-500/10 p-4 bg-[#050f09]/80 flex items-center gap-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            placeholder="Ask advisor about budget targets, compound yield models, etc..."
            className="flex-1 bg-[#07130c] border border-emerald-500/15 focus:border-emerald-500/40 text-white placeholder-slate-600 rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all"
          />

          <button
            onClick={handleSendMessage}
            disabled={chatLoading}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-bold px-6 py-3.5 rounded-xl text-sm hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>

      </div>

    </div>
  );
}
