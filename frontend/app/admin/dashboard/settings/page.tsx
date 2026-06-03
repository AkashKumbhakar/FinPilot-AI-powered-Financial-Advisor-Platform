"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { toast } from "react-toastify";

import {
  ShieldCheck,
  Lock,
  Save,
  Settings,
  LogOut,
  Trash2,
  Users,
  Crown,
  IndianRupee,
  Activity,
  Server,
  Bell,
  Pencil,
  Mail,
  User,
} from "lucide-react";

interface AdminProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminSettingsPage() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [editing, setEditing] =
    useState(false);

  const [profile, setProfile] =
    useState<AdminProfile | null>(
      null
    );

  const [profileData, setProfileData] =
    useState({
      name: "",
      email: "",
    });

  const [passwordData, setPasswordData] =
    useState({
      currentPassword: "",
      newPassword: "",
    });

  // FETCH ADMIN PROFILE

  const fetchProfile =
    async () => {
      try {
        const res =
          await api.get(
            "/user/profile"
          );

        setProfile(
          res.data.data
        );

        setProfileData({
          name:
            res.data.data.name,
          email:
            res.data.data.email,
        });
      } catch (error) {
        toast.error(
          "Failed to load admin profile"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchProfile();
  }, []);

  // UPDATE PROFILE

  const handleUpdateProfile =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      try {
        setSaving(true);

        const res =
          await api.put(
            "/user/update-profile",
            profileData
          );

        toast.success(
          res.data.message ||
            "Profile updated"
        );

        setProfile(
          res.data.user
        );

        setEditing(false);
      } catch (
        error: any
      ) {
        toast.error(
          error.response?.data
            ?.message ||
            "Update failed"
        );
      } finally {
        setSaving(false);
      }
    };

  // CHANGE PASSWORD

  const handlePasswordChange =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      try {
        setSaving(true);

        const res =
          await api.put(
            "/user/change-password",
            passwordData
          );

        toast.success(
          res.data.message ||
            "Password updated"
        );

        setPasswordData({
          currentPassword:
            "",
          newPassword: "",
        });
      } catch (
        error: any
      ) {
        toast.error(
          error.response?.data
            ?.message ||
            "Failed to update password"
        );
      } finally {
        setSaving(false);
      }
    };

  // LOGOUT

  const handleLogout =
    async () => {
      try {
        await api.post(
          "/auth/logout"
        );

        localStorage.removeItem(
          "token"
        );

        toast.success(
          "Admin logged out"
        );

        router.push(
          "/admin/login"
        );
      } catch {
        toast.error(
          "Logout failed"
        );
      }
    };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030805] flex items-center justify-center">
        <div className="h-14 w-14 rounded-full border-b-2 border-emerald-400 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-[#E2E8F0]">

      {/* HEADER */}

      <div className="bg-[#050f09] border border-emerald-500/10 rounded-3xl p-7 relative overflow-hidden">

        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 blur-3xl rounded-full" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div>
            <h1 className="text-3xl font-black text-white">
              Admin Settings
            </h1>

            <p className="text-slate-500 text-sm mt-2">
              Configure administrator account,
              security & platform preferences.
            </p>
          </div>

          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-bold px-6 py-4 rounded-2xl flex items-center gap-3 shadow-lg shadow-emerald-500/10">
            <Settings className="w-5 h-5" />
            System Administration
          </div>
        </div>
      </div>

      {/* PROFILE */}

      <div className="bg-[#050f09]/70 border border-emerald-500/10 rounded-3xl p-8">

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">

          <div className="flex flex-col md:flex-row md:items-center gap-6">

            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-black text-4xl font-black shadow-lg shadow-emerald-500/20">
              {profile?.name
                ?.charAt(0)
                .toUpperCase()}
            </div>

            <div>

              {editing ? (

                <form
                  onSubmit={
                    handleUpdateProfile
                  }
                  className="space-y-4"
                >

                  <input
                    type="text"
                    value={
                      profileData.name
                    }
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        name:
                          e.target
                            .value,
                      })
                    }
                    placeholder="Admin Name"
                    className="w-full bg-[#07130c] border border-emerald-500/15 rounded-xl px-5 py-3 text-sm outline-none focus:border-emerald-500/40"
                  />

                  <input
                    type="email"
                    value={
                      profileData.email
                    }
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        email:
                          e.target
                            .value,
                      })
                    }
                    placeholder="Admin Email"
                    className="w-full bg-[#07130c] border border-emerald-500/15 rounded-xl px-5 py-3 text-sm outline-none focus:border-emerald-500/40"
                  />

                  <div className="flex gap-3">

                    <button
                      type="submit"
                      disabled={
                        saving
                      }
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-bold px-6 py-3 rounded-xl"
                    >
                      Save
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setEditing(
                          false
                        )
                      }
                      className="bg-[#07130c] border border-emerald-500/10 text-slate-300 px-6 py-3 rounded-xl"
                    >
                      Cancel
                    </button>

                  </div>

                </form>

              ) : (

                <>

                  <div className="flex items-center gap-3">

                    <h2 className="text-3xl font-black text-white">
                      {profile?.name}
                    </h2>

                    <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-lg text-xs font-bold uppercase">
                      Admin
                    </span>

                  </div>

                  <div className="space-y-2 mt-4">

                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Mail className="w-4 h-4 text-emerald-400" />
                      {profile?.email}
                    </div>

                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Super Admin Access Enabled
                    </div>

                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                      <User className="w-4 h-4" />
                      Joined{" "}
                      {new Date(
                        profile?.createdAt ||
                          ""
                      ).toLocaleDateString(
                        "en-IN"
                      )}
                    </div>

                  </div>

                </>
              )}
            </div>
          </div>

          {!editing && (
            <button
              onClick={() =>
                setEditing(true)
              }
              className="bg-[#07130c] hover:bg-[#0c2013] border border-emerald-500/10 hover:border-emerald-500/20 text-emerald-400 px-6 py-4 rounded-2xl flex items-center gap-3 font-semibold transition"
            >
              <Pencil className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* SETTINGS GRID */}

      <div className="grid xl:grid-cols-2 gap-6">

        {/* SECURITY */}

        <div className="bg-[#050f09]/70 border border-emerald-500/10 rounded-3xl p-7">

          <div className="flex items-center gap-4 mb-8">

            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">
              <Lock className="w-6 h-6 text-emerald-400" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                Security Settings
              </h2>

              <p className="text-slate-500 text-xs mt-1">
                Manage admin credentials & access
              </p>
            </div>
          </div>

          <form
            onSubmit={
              handlePasswordChange
            }
            className="space-y-5"
          >

            <input
              type="password"
              required
              value={
                passwordData.currentPassword
              }
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword:
                    e.target.value,
                })
              }
              placeholder="Current Password"
              className="w-full bg-[#07130c] border border-emerald-500/15 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-emerald-500/40"
            />

            <input
              type="password"
              required
              value={
                passwordData.newPassword
              }
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword:
                    e.target.value,
                })
              }
              placeholder="New Password"
              className="w-full bg-[#07130c] border border-emerald-500/15 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-emerald-500/40"
            />

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition"
            >
              <Save className="w-4 h-4" />
              {saving
                ? "Updating..."
                : "Update Password"}
            </button>

          </form>
        </div>

        {/* PLATFORM OVERVIEW */}

        <div className="bg-[#050f09]/70 border border-emerald-500/10 rounded-3xl p-7">

          <div className="flex items-center gap-4 mb-8">

            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">
              <Server className="w-6 h-6 text-emerald-400" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                Platform Overview
              </h2>

              <p className="text-slate-500 text-xs mt-1">
                FinPilot AI administration metrics
              </p>
            </div>
          </div>

          <div className="space-y-4">

            {/* USERS */}

            <div className="bg-[#07130c]/50 border border-emerald-500/5 rounded-2xl p-5 flex items-center justify-between">

              <div className="flex items-center gap-4">

                <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">
                  <Users className="w-5 h-5 text-emerald-400" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">
                    User Management
                  </h3>

                  <p className="text-xs text-slate-500 mt-1">
                    Control platform users
                  </p>
                </div>
              </div>

              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-lg text-xs font-bold">
                ACTIVE
              </span>
            </div>

            {/* SUBSCRIPTIONS */}

            <div className="bg-[#07130c]/50 border border-emerald-500/5 rounded-2xl p-5 flex items-center justify-between">

              <div className="flex items-center gap-4">

                <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-xl">
                  <Crown className="w-5 h-5 text-yellow-400" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">
                    Premium Billing
                  </h3>

                  <p className="text-xs text-slate-500 mt-1">
                    Subscription monitoring enabled
                  </p>
                </div>
              </div>

              <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1 rounded-lg text-xs font-bold">
                ₹299 PLAN
              </span>
            </div>

            {/* REVENUE */}

            <div className="bg-[#07130c]/50 border border-emerald-500/5 rounded-2xl p-5 flex items-center justify-between">

              <div className="flex items-center gap-4">

                <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl">
                  <IndianRupee className="w-5 h-5 text-blue-400" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">
                    Revenue Engine
                  </h3>

                  <p className="text-xs text-slate-500 mt-1">
                    Financial analytics operational
                  </p>
                </div>
              </div>

              <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-lg text-xs font-bold">
                ONLINE
              </span>
            </div>

            {/* SYSTEM */}

            <div className="bg-[#07130c]/50 border border-emerald-500/5 rounded-2xl p-5 flex items-center justify-between">

              <div className="flex items-center gap-4">

                <div className="bg-purple-500/10 border border-purple-500/20 p-3 rounded-xl">
                  <Activity className="w-5 h-5 text-purple-400" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">
                    System Status
                  </h3>

                  <p className="text-xs text-slate-500 mt-1">
                    AI finance platform health
                  </p>
                </div>
              </div>

              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-lg text-xs font-bold">
                STABLE
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* DANGER ZONE */}

      <div className="bg-red-500/5 border border-red-500/15 rounded-3xl p-7">

        <div className="flex items-center gap-4 mb-6">

          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl">
            <Bell className="w-6 h-6 text-red-400" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-red-400">
              Admin Actions
            </h2>

            <p className="text-slate-500 text-xs mt-1">
              Sensitive administrative operations
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">

          <button
            onClick={
              handleLogout
            }
            className="flex items-center justify-center gap-2 bg-[#120808] border border-red-500/20 hover:border-red-500/40 text-red-400 px-6 py-4 rounded-2xl font-bold transition"
          >
            <LogOut className="w-5 h-5" />
            Logout Admin
          </button>

          <button
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 text-black font-bold px-6 py-4 rounded-2xl"
          >
            <Trash2 className="w-5 h-5" />
            Disable Platform
          </button>

        </div>
      </div>
    </div>
  );
}