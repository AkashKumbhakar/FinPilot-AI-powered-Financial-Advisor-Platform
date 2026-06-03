"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { motion } from "framer-motion";
import {
  BrainCircuit,
  Search,
  ShieldCheck,
  ShieldX,
  Trash2,
  Users,
  Crown,
  Mail,
  Calendar,
  Loader2,
} from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  is_verified: boolean;
  isBlocked: boolean;
  subscription: {
    plan: string;
    status: string;
  };
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] =
    useState<User[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [actionLoading, setActionLoading] =
    useState("");

  // FETCH USERS
  const fetchUsers = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await api.get(
        "/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(res.data.users);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // BLOCK / UNBLOCK USER
  const handleBlockUser = async (
    id: string
  ) => {
    try {
      setActionLoading(id);

      const token =
        localStorage.getItem("token");

      await api.put(
        `/admin/block-user/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers((prev) =>
        prev.map((user) =>
          user._id === id
            ? {
                ...user,
                isBlocked:
                  !user.isBlocked,
              }
            : user
        )
      );
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading("");
    }
  };

  // DELETE USER
  const handleDeleteUser = async (
    id: string
  ) => {
    const confirmDelete =
      confirm(
        "Are you sure you want to delete this user?"
      );

    if (!confirmDelete) return;

    try {
      setActionLoading(id);

      const token =
        localStorage.getItem("token");

      await api.delete(
        `/admin/delete-user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers((prev) =>
        prev.filter(
          (user) => user._id !== id
        )
      );
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading("");
    }
  };

  // FILTER USERS
  const filteredUsers =
    users.filter((user) =>
      user.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      user.email
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <main className="min-h-screen bg-[#030805] text-[#E2E8F0] p-6 md:p-10">

      {/* BACKGROUND GLOW */}
      <div className="fixed top-0 right-0 w-[450px] h-[450px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          <div>
            <div className="flex items-center gap-3 mb-3">

              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <BrainCircuit className="w-6 h-6 text-black" />
              </div>

              <div>
                <h1 className="text-3xl font-black text-white">
                  User Management
                </h1>

                <p className="text-slate-400 text-sm mt-1">
                  Manage platform users,
                  subscriptions and account
                  access.
                </p>
              </div>
            </div>
          </div>

          {/* SEARCH */}
          <div className="relative w-full md:w-[320px]">

            <Search className="w-4 h-4 absolute left-4 top-3.5 text-slate-500" />

            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full bg-[#07110c] border border-emerald-500/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-white outline-none focus:border-emerald-500/30"
            />
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* TOTAL USERS */}
          <div className="bg-[#07110c] border border-emerald-500/10 rounded-3xl p-6">

            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">
                  Total Users
                </p>

                <h2 className="text-3xl font-black text-white mt-2">
                  {users.length}
                </h2>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                <Users className="w-7 h-7 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* PREMIUM USERS */}
          <div className="bg-[#07110c] border border-emerald-500/10 rounded-3xl p-6">

            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">
                  Premium Users
                </p>

                <h2 className="text-3xl font-black text-white mt-2">
                  {
                    users.filter(
                      (u) =>
                        u.subscription
                          ?.plan ===
                        "premium"
                    ).length
                  }
                </h2>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center">
                <Crown className="w-7 h-7 text-yellow-400" />
              </div>
            </div>
          </div>

          {/* BLOCKED USERS */}
          <div className="bg-[#07110c] border border-emerald-500/10 rounded-3xl p-6">

            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">
                  Blocked Users
                </p>

                <h2 className="text-3xl font-black text-white mt-2">
                  {
                    users.filter(
                      (u) => u.isBlocked
                    ).length
                  }
                </h2>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center">
                <ShieldX className="w-7 h-7 text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-[#07110c]/80 border border-emerald-500/10 rounded-3xl overflow-hidden">

          {/* TABLE HEADER */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-emerald-500/10 text-xs uppercase tracking-wider text-slate-500 font-bold">

            <div className="col-span-3">
              User
            </div>

            <div className="col-span-2">
              Plan
            </div>

            <div className="col-span-2">
              Status
            </div>

            <div className="col-span-2">
              Joined
            </div>

            <div className="col-span-3 text-right">
              Actions
            </div>
          </div>

          {/* USERS */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              No users found.
            </div>
          ) : (
            filteredUsers.map((user) => (
              <motion.div
                key={user._id}
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="grid grid-cols-12 gap-4 px-6 py-5 border-b border-emerald-500/5 hover:bg-emerald-500/[0.02] transition"
              >

                {/* USER */}
                <div className="col-span-3">

                  <h3 className="font-bold text-white">
                    {user.name}
                  </h3>

                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                    <Mail className="w-3 h-3" />
                    {user.email}
                  </div>
                </div>

                {/* PLAN */}
                <div className="col-span-2 flex items-center">

                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-bold border ${
                      user.subscription
                        ?.plan ===
                      "premium"
                        ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    }`}
                  >
                    {user.subscription
                      ?.plan || "trial"}
                  </span>
                </div>

                {/* STATUS */}
                <div className="col-span-2 flex items-center">

                  {user.isBlocked ? (
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                      Blocked
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Active
                    </span>
                  )}
                </div>

                {/* DATE */}
                <div className="col-span-2 flex items-center gap-2 text-sm text-slate-400">

                  <Calendar className="w-4 h-4" />

                  {new Date(
                    user.createdAt
                  ).toLocaleDateString()}
                </div>

                {/* ACTIONS */}
                <div className="col-span-3 flex items-center justify-end gap-3">

                  {/* BLOCK */}
                  <button
                    onClick={() =>
                      handleBlockUser(
                        user._id
                      )
                    }
                    disabled={
                      actionLoading ===
                      user._id
                    }
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                      user.isBlocked
                        ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                        : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    }`}
                  >
                    {user.isBlocked ? (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        Unblock
                      </>
                    ) : (
                      <>
                        <ShieldX className="w-4 h-4" />
                        Block
                      </>
                    )}
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() =>
                      handleDeleteUser(
                        user._id
                      )
                    }
                    disabled={
                      actionLoading ===
                      user._id
                    }
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-red-500/10 text-slate-300 hover:text-red-400 transition flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}