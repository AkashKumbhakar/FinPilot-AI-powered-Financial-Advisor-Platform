"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { toast } from "react-toastify";
import {
  User,
  Mail,
  Shield,
  Bell,
  Lock,
  LogOut,
  Trash2,
  Settings,
  Save,
  Pencil,
} from "lucide-react";

interface ProfileData {
  _id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  // FETCH PROFILE
  const fetchProfile = async () => {
    try {
      const res = await api.get("/user/profile");
      setProfile(res.data.data);
      setProfileData({
        name: res.data.data.name,
        email: res.data.data.email,
      });
    } catch (error: any) {
      console.error("Error fetching settings profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // UPDATE PROFILE
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.put("/user/update-profile", profileData);
      toast.success(res.data.message || "Profile updated successfully");
      setProfile(res.data.user);
      setEditing(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // CHANGE PASSWORD
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.put("/user/change-password", passwordData);
      toast.success(res.data.message || "Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  // LOGOUT
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      localStorage.removeItem("token");
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      console.error("Error during logout transaction:", error);
      toast.error("Logout failed");
    }
  };

  // DELETE ACCOUNT
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );
    if (!confirmDelete) return;

    try {
      const res = await api.delete("/user/delete-account");
      toast.success(res.data.message || "Account deleted");
      localStorage.removeItem("token");
      router.push("/register");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete account");
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
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 bg-[#050f09] border border-emerald-500/10 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white leading-none">
            Settings
          </h1>
          <p className="text-slate-500 text-xs mt-2 font-medium">
            Manage your account settings & preferences
          </p>
        </div>

        <div
          className="
          bg-gradient-to-r from-emerald-500 to-teal-600
          px-6 py-4 rounded-xl
          flex items-center gap-3
          font-bold text-black text-sm
          shadow-lg shadow-emerald-500/10
          "
        >
          <Settings className="w-5 h-5 animate-spin-slow" style={{ animationDuration: '6s' }} />
          Account Settings
        </div>
      </div>

      {/* PROFILE CARD */}
      <div
        className="
        bg-[#050f09]/60
        border border-emerald-500/10
        rounded-2xl
        p-8
        relative
        overflow-hidden
        shadow-sm
        "
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div
              className="
              w-24 h-24
              rounded-2xl
              bg-gradient-to-br from-emerald-400 to-teal-500
              flex items-center justify-center
              text-4xl font-extrabold text-black
              shadow-lg shadow-emerald-500/10
              shrink-0
              "
            >
              {profile?.name?.charAt(0).toUpperCase()}
            </div>

            <div className="space-y-1">
              {editing ? (
                <form
                  onSubmit={handleUpdateProfile}
                  className="space-y-4 max-w-md"
                >
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          name: e.target.value,
                        })
                      }
                      className="
                      w-full
                      bg-[#07130c]
                      border border-emerald-500/15
                      focus:border-emerald-500/40
                      text-white
                      placeholder-slate-600
                      rounded-xl
                      py-3.5 px-5
                      text-sm
                      outline-none
                      focus:ring-1 focus:ring-emerald-500/30
                      transition-all
                      "
                      placeholder="Your Name"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                      className="
                      w-full
                      bg-[#07130c]
                      border border-emerald-500/15
                      focus:border-emerald-500/40
                      text-white
                      placeholder-slate-600
                      rounded-xl
                      py-3.5 px-5
                      text-sm
                      outline-none
                      focus:ring-1 focus:ring-emerald-500/30
                      transition-all
                      "
                      placeholder="Your Email"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="
                      bg-gradient-to-r from-emerald-500 to-teal-600
                      text-black font-bold
                      px-6 py-3
                      rounded-xl
                      text-sm
                      hover:from-emerald-400 hover:to-teal-500
                      shadow-md
                      transition-all
                      "
                    >
                      Save Changes
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="
                      bg-[#07130c]
                      hover:bg-[#0c2013]
                      border border-emerald-500/20
                      text-slate-300
                      px-6 py-3
                      rounded-xl
                      text-sm
                      transition-all
                      "
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h2 className="text-3xl font-extrabold text-white">
                    {profile?.name}
                  </h2>

                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Mail className="w-4 h-4 text-emerald-400" />
                    {profile?.email}
                  </div>

                  <div className="flex items-center gap-2 text-slate-400 text-sm pt-0.5">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span className="font-medium text-emerald-400">Secure Account</span>
                  </div>

                  {profile?.createdAt && (
                    <p className="text-xs text-slate-500 pt-1 font-medium">
                      Joined on{" "}
                      {new Date(profile.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="
              bg-[#050f09]
              hover:bg-[#07170e]
              border border-emerald-500/10
              hover:border-emerald-500/20
              px-6 py-4
              rounded-xl
              flex items-center gap-3
              transition
              text-emerald-400
              font-semibold
              "
            >
              <Pencil className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* SETTINGS GRID */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* SECURITY */}
        <div
          className="
          bg-[#050f09]/60
          border border-emerald-500/10
          rounded-2xl
          p-6
          hover:border-emerald-500/15
          transition
          duration-300
          relative
          overflow-hidden
          "
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/20">
              <Lock className="w-6 h-6 text-emerald-400" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                Security
              </h2>
              <p className="text-slate-500 text-xs mt-1">
                Update your account password
              </p>
            </div>
          </div>

          <form
            onSubmit={handlePasswordChange}
            className="space-y-5"
          >
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 tracking-wide block">
                Current Password
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                required
                placeholder="••••••••"
                className="
                w-full
                bg-[#07130c]
                border border-emerald-500/15
                focus:border-emerald-500/40
                text-white
                placeholder-slate-600
                rounded-xl
                py-3.5 px-5
                text-sm
                outline-none
                focus:ring-1 focus:ring-emerald-500/30
                transition-all
                "
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 tracking-wide block">
                New Password
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                required
                placeholder="••••••••"
                className="
                w-full
                bg-[#07130c]
                border border-emerald-500/15
                focus:border-emerald-500/40
                text-white
                placeholder-slate-600
                rounded-xl
                py-3.5 px-5
                text-sm
                outline-none
                focus:ring-1 focus:ring-emerald-500/30
                transition-all
                "
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="
              w-full
              bg-gradient-to-r from-emerald-500 to-teal-600
              text-black font-bold
              py-3.5
              rounded-xl
              text-sm
              hover:from-emerald-400 hover:to-teal-500
              shadow-lg shadow-emerald-500/10
              hover:shadow-emerald-500/30
              transition-all duration-300
              hover:-translate-y-0.5
              flex items-center justify-center gap-2
              "
            >
              <Save className="w-4 h-4" />
              {saving ? "Updating..." : "Change Password"}
            </button>
          </form>
        </div>

        {/* ACCOUNT OVERVIEW */}
        <div
          className="
          bg-[#050f09]/60
          border border-emerald-500/10
          rounded-2xl
          p-6
          hover:border-emerald-500/15
          transition
          duration-300
          relative
          overflow-hidden
          "
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/20">
              <Shield className="w-6 h-6 text-emerald-400" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                Account Overview
              </h2>
              <p className="text-slate-500 text-xs mt-1">
                Your financial account status
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* ACCOUNT STATUS */}
            <div
              className="
              bg-[#07130c]/40
              border border-emerald-500/5
              rounded-xl
              p-5
              flex items-center justify-between
              "
            >
              <div className="flex items-center gap-4">
                <div className="bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/25">
                  <User className="w-5 h-5 text-emerald-400" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">
                    Account Status
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Your account is active & secured
                  </p>
                </div>
              </div>

              <span
                className="
                bg-emerald-500/10
                text-emerald-400
                border border-emerald-500/20
                px-3 py-1.5
                rounded-lg
                text-xs font-bold
                uppercase tracking-wider
                "
              >
                Active
              </span>
            </div>

            {/* SECURITY LEVEL */}
            <div
              className="
              bg-[#07130c]/40
              border border-emerald-500/5
              rounded-xl
              p-5
              flex items-center justify-between
              "
            >
              <div className="flex items-center gap-4">
                <div className="bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/25">
                  <Lock className="w-5 h-5 text-emerald-400" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">
                    Security Level
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Password protection enabled
                  </p>
                </div>
              </div>

              <span
                className="
                bg-teal-500/10
                text-teal-400
                border border-teal-500/20
                px-3 py-1.5
                rounded-lg
                text-xs font-bold
                uppercase tracking-wider
                "
              >
                High
              </span>
            </div>

            {/* MEMBER SINCE */}
            <div
              className="
              bg-[#07130c]/40
              border border-emerald-500/5
              rounded-xl
              p-5
              flex items-center justify-between
              "
            >
              <div className="flex items-center gap-4">
                <div className="bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/25">
                  <Bell className="w-5 h-5 text-emerald-400" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">
                    Member Since
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Joined the finance platform
                  </p>
                </div>
              </div>

              <span className="text-slate-300 text-xs font-semibold">
                {profile?.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })
                  : "N/A"}
              </span>
            </div>

            {/* APP VERSION */}
            <div
              className="
              bg-[#07130c]/40
              border border-emerald-500/5
              rounded-xl
              p-5
              flex items-center justify-between
              "
            >
              <div className="flex items-center gap-4">
                <div className="bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/25">
                  <Settings className="w-5 h-5 text-emerald-400" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">
                    Application Version
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    AI Finance Dashboard
                  </p>
                </div>
              </div>

              <span
                className="
                bg-[#050f09]
                border border-emerald-500/10
                text-slate-400
                px-3 py-1.5
                rounded-lg
                text-xs font-semibold
                "
              >
                v1.0.0
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DANGER ZONE */}
      <div
        className="
        bg-red-500/5
        border border-red-500/15
        rounded-2xl
        p-6
        relative
        overflow-hidden
        shadow-sm
        "
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-red-500/10 p-3 rounded-xl border border-red-500/20">
            <Trash2 className="w-6 h-6 text-red-400" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-red-400">
              Danger Zone
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              Sensitive account actions
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={handleLogout}
            className="
            flex items-center justify-center gap-2
            bg-[#0d0707]
            hover:bg-[#1a0f0f]
            border border-red-500/20
            hover:border-red-500/30
            px-6 py-4
            rounded-xl
            text-red-400
            transition
            text-sm font-bold
            shadow-sm
            "
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>

          <button
            onClick={handleDeleteAccount}
            className="
            flex items-center justify-center gap-2
            bg-gradient-to-r from-red-500 to-rose-600
            hover:from-red-400 hover:to-rose-500
            text-black font-bold
            px-6 py-4
            rounded-xl
            transition
            text-sm
            shadow-lg shadow-red-500/10
            hover:shadow-red-500/20
            "
          >
            <Trash2 className="w-5 h-5" />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
