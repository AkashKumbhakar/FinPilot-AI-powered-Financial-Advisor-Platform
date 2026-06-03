"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingDown,
  TrendingUp,
  PiggyBank,
  Repeat,
  Brain,
  Goal,
  FileText,
  CreditCard,
  Settings,
  X,
  BrainCircuit,
  Sparkles,
  UserCheck
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
}

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps) {
  const pathname = usePathname();

  const sidebarItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      name: "Expenses",
      icon: TrendingDown,
      href: "/dashboard/expenses",
    },
    {
      name: "Income",
      icon: TrendingUp,
      href: "/dashboard/income",
    },
    {
      name: "Budgets",
      icon: PiggyBank,
      href: "/dashboard/budgets",
    },
    {
      name: "Recurring",
      icon: Repeat,
      href: "/dashboard/recurring",
    },
    {
      name: "AI Advisor",
      icon: Brain,
      href: "/dashboard/ai-advisor",
    },
    {
      name: "Goals",
      icon: Goal,
      href: "/dashboard/goals",
    },
    {
      name: "Reports",
      icon: FileText,
      href: "/dashboard/reports",
    },
    {
      name: "Billing",
      icon: CreditCard,
      href: "/dashboard/billing",
    },
    {
      name: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
    },
  ];

  return (
    <>
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:static z-50 top-0 left-0 h-screen
          w-[280px]
          bg-[#030805]
          border-r border-emerald-950/50
          flex flex-col justify-between
          transition-transform duration-300 ease-in-out
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <div>
          {/* HEADER & LOGO */}
          <div className="h-20 border-b border-emerald-950/40 flex items-center justify-between px-6 bg-[#030805]/80 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/10">
                <BrainCircuit className="w-5.5 h-5.5 text-black" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white leading-none">
                  FinPilot <span className="text-emerald-400">AI</span>
                </h1>
                <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase block mt-0.5">
                  Advisor Platform
                </span>
              </div>
            </div>

            <button
              className="lg:hidden p-1.5 rounded-lg border border-emerald-950/40 text-slate-400 hover:text-white hover:border-emerald-500/20 transition-all focus:outline-none"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* NAVIGATION LINKS */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-190px)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3.5
                    px-4 py-3
                    rounded-xl
                    transition-all duration-200
                    group relative
                    ${
                      isActive
                        ? "bg-emerald-950/40 border border-emerald-500/15 text-emerald-400 shadow-sm shadow-emerald-500/5 font-semibold"
                        : "text-slate-400 hover:bg-emerald-950/20 hover:text-emerald-300 font-medium"
                    }
                  `}
                >
                  {/* Left indicator bar for active link */}
                  {isActive && (
                    <span className="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-md bg-gradient-to-b from-emerald-400 to-teal-500" />
                  )}

                  <item.icon
                    className={`
                      w-5 h-5 transition-transform duration-200 group-hover:scale-105
                      ${
                        isActive
                          ? "text-emerald-400"
                          : "text-slate-500 group-hover:text-emerald-400"
                      }
                    `}
                  />

                  <span className="text-sm">
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
