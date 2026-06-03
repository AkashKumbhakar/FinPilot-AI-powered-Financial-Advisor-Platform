"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
  Crown,
  Search,
  Calendar,
  Mail,
  User,
  BadgeIndianRupee,
  CheckCircle2,
  XCircle,
  Sparkles,
} from "lucide-react";

interface SubscriptionUser {
  _id: string;
  name: string;
  email: string;

  subscription: {
    plan: string;
    status: string;
    subscriptionEndsAt?: string;
    trialEndsAt?: string;
  };

  createdAt: string;
}

export default function AdminSubscriptionsPage() {

  const [users, setUsers] =
    useState<SubscriptionUser[]>(
      []
    );

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  // FETCH SUBSCRIPTIONS

  const fetchSubscriptions =
    async () => {
      try {

        const res =
          await api.get(
            "/admin/subscriptions"
          );

        setUsers(
          res.data.users || []
        );

      } catch (error) {

        console.error(
          "Subscription fetch error:",
          error
        );

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // FILTER USERS

  const filteredUsers =
    users.filter((user) =>
      user.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||
      user.email
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  // TOTAL REVENUE

  const monthlyRevenue =
    filteredUsers.length * 299;

  if (loading) {
    return (
      <div className="min-h-[80vh] bg-[#030805] flex items-center justify-center">
        <div className="h-14 w-14 rounded-full border-b-2 border-emerald-400 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-[#E2E8F0]">

      {/* HEADER */}

      <div className="bg-[#050f09] border border-emerald-500/10 rounded-3xl p-7 relative overflow-hidden">

        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div>

            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full text-xs font-bold text-emerald-400 mb-4">
              <Sparkles className="w-4 h-4" />
              PREMIUM SUBSCRIPTIONS
            </div>

            <h1 className="text-3xl font-black text-white">
              Subscription Management
            </h1>

            <p className="text-slate-500 text-sm mt-2">
              Monitor premium members,
              active plans & platform revenue.
            </p>

          </div>

          <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-7 py-5 rounded-2xl shadow-lg shadow-yellow-500/10">

            <div className="flex items-center gap-3">

              <div className="bg-black/10 p-3 rounded-xl">
                <BadgeIndianRupee className="w-6 h-6" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest">
                  Monthly Revenue
                </p>

                <h2 className="text-3xl font-black leading-none mt-1">
                  ₹{monthlyRevenue}
                </h2>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* STATS */}

      <div className="grid md:grid-cols-3 gap-5">

        {/* TOTAL PREMIUM */}

        <div className="bg-[#050f09]/70 border border-emerald-500/10 rounded-2xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 text-xs uppercase tracking-wider font-bold">
                Premium Users
              </p>

              <h2 className="text-3xl font-black text-white mt-3">
                {filteredUsers.length}
              </h2>

            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-2xl">
              <Crown className="w-7 h-7 text-yellow-400" />
            </div>

          </div>
        </div>

        {/* ACTIVE USERS */}

        <div className="bg-[#050f09]/70 border border-emerald-500/10 rounded-2xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 text-xs uppercase tracking-wider font-bold">
                Active Plans
              </p>

              <h2 className="text-3xl font-black text-white mt-3">
                {
                  filteredUsers.filter(
                    (u) =>
                      u.subscription
                        .status ===
                      "active"
                  ).length
                }
              </h2>

            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            </div>

          </div>
        </div>

        {/* INACTIVE */}

        <div className="bg-[#050f09]/70 border border-emerald-500/10 rounded-2xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 text-xs uppercase tracking-wider font-bold">
                Inactive Plans
              </p>

              <h2 className="text-3xl font-black text-white mt-3">
                {
                  filteredUsers.filter(
                    (u) =>
                      u.subscription
                        .status ===
                      "inactive"
                  ).length
                }
              </h2>

            </div>

            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl">
              <XCircle className="w-7 h-7 text-red-400" />
            </div>

          </div>
        </div>

      </div>

      {/* SEARCH */}

      <div className="bg-[#050f09]/70 border border-emerald-500/10 rounded-2xl p-5">

        <div className="relative">

          <Search className="w-5 h-5 text-slate-500 absolute left-4 top-3.5" />

          <input
            type="text"
            placeholder="Search premium users..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="w-full bg-[#07130c] border border-emerald-500/10 focus:border-emerald-500/30 rounded-xl py-3 pl-12 pr-4 text-sm text-white outline-none"
          />
        </div>
      </div>

      {/* TABLE */}

      <div className="bg-[#050f09]/70 border border-emerald-500/10 rounded-3xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-[#07130c] border-b border-emerald-500/10">

              <tr className="text-left">

                <th className="px-6 py-5 text-xs uppercase tracking-wider text-slate-500 font-bold">
                  User
                </th>

                <th className="px-6 py-5 text-xs uppercase tracking-wider text-slate-500 font-bold">
                  Plan
                </th>

                <th className="px-6 py-5 text-xs uppercase tracking-wider text-slate-500 font-bold">
                  Status
                </th>

                <th className="px-6 py-5 text-xs uppercase tracking-wider text-slate-500 font-bold">
                  Subscription End
                </th>

                <th className="px-6 py-5 text-xs uppercase tracking-wider text-slate-500 font-bold">
                  Revenue
                </th>

              </tr>
            </thead>

            <tbody>

              {filteredUsers.length ===
              0 ? (

                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-16 text-slate-500"
                  >
                    No premium users found
                  </td>
                </tr>

              ) : (

                filteredUsers.map(
                  (user) => (

                    <tr
                      key={user._id}
                      className="border-b border-emerald-500/5 hover:bg-[#07130c]/40 transition"
                    >

                      {/* USER */}

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-4">

                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-black font-black">
                            {user.name
                              ?.charAt(
                                0
                              )
                              .toUpperCase()}
                          </div>

                          <div>

                            <h3 className="text-sm font-bold text-white">
                              {user.name}
                            </h3>

                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                              <Mail className="w-3.5 h-3.5" />
                              {user.email}
                            </div>

                          </div>
                        </div>
                      </td>

                      {/* PLAN */}

                      <td className="px-6 py-5">

                        <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-xl text-yellow-400 text-xs font-bold uppercase tracking-wider">

                          <Crown className="w-4 h-4" />

                          {user.subscription
                            .plan}

                        </div>
                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-5">

                        <span
                          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border ${
                            user
                              .subscription
                              .status ===
                            "active"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-red-500/10 text-red-400 border-red-500/20"
                          }`}
                        >
                          {
                            user
                              .subscription
                              .status
                          }
                        </span>
                      </td>

                      {/* END DATE */}

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-2 text-sm text-slate-300">

                          <Calendar className="w-4 h-4 text-emerald-400" />

                          {user.subscription
                            .subscriptionEndsAt
                            ? new Date(
                                user.subscription.subscriptionEndsAt
                              ).toLocaleDateString(
                                "en-IN"
                              )
                            : "N/A"}

                        </div>
                      </td>

                      {/* REVENUE */}

                      <td className="px-6 py-5">

                        <div className="text-emerald-400 font-black text-lg">
                          ₹299
                        </div>

                      </td>

                    </tr>
                  )
                )
              )}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}