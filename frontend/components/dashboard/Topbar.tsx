"use client";

import { useEffect, useRef, useState } from "react";
import api from "@/lib/axios";
import socket from "@/lib/socket";
import { toast } from "react-toastify";
import {
  Bell,
  Menu,
  Trash2,
  User,
  CheckCheck,
  X,
  Sparkles
} from "lucide-react";

interface NotificationData {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt?: string;
}

interface UserData {
  name: string;
  email: string;
}

interface TopbarProps {
  title: string;
  subtitle: string;
  setSidebarOpen: (value: boolean) => void;
  // Included to match interface signature, even if local state is preferred
  notifications?: NotificationData[];
  markAsRead?: (id: string) => Promise<void>;
  deleteNotification?: (id: string) => Promise<void>;
}

export default function Topbar({
  title,
  subtitle,
  setSidebarOpen,
}: TopbarProps) {
  const notificationRef = useRef<HTMLDivElement | null>(null);

  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [openNotification, setOpenNotification] = useState(false);
  const [profile, setProfile] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);

  // FETCH PROFILE
  const fetchProfile = async () => {
    try {
      const res = await api.get("/user/profile");
      setProfile(res.data.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  // FETCH NOTIFICATIONS
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/notification/all");
      setNotifications(res.data.data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // MARK AS READ
  const handleMarkAsRead = async (id: string) => {
    try {
      // UPDATE UI IMMEDIATELY (Optimistic UI update)
      setNotifications((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                isRead: true,
              }
            : item
        )
      );

      // API CALL
      await api.put(`/notification/read/${id}`);
    } catch (error) {
      // ROLLBACK IF ERROR
      setNotifications((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                isRead: false,
              }
            : item
        )
      );
      console.error("Error marking notification as read:", error);
    }
  };

  // DELETE NOTIFICATION
  const handleDeleteNotification = async (id: string) => {
    try {
      await api.delete(`/notification/delete/${id}`);

      setNotifications((prev) => prev.filter((item) => item._id !== id));
      toast.success("Notification deleted");
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // INITIAL FETCH
  useEffect(() => {
    fetchProfile();
    fetchNotifications();
  }, []);

  // SOCKET CONNECTION
  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      socket.emit("registerUser", userId);
    }

    socket.on("newNotification", (data: NotificationData) => {
      setNotifications((prev) => {
        // CHECK IF EXISTS
        const exists = prev.some((item) => item._id === data._id);

        // IF EXISTS UPDATE IT
        if (exists) {
          return prev.map((item) => (item._id === data._id ? data : item));
        }

        // OTHERWISE ADD NEW
        return [data, ...prev];
      });

      toast.success(data.message);
    });

    return () => {
      socket.off("newNotification");
    };
  }, []);

  // CLOSE DROPDOWN OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setOpenNotification(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // UNREAD COUNT
  const unreadCount = notifications.reduce(
    (count, item) => (item.isRead ? count : count + 1),
    0
  );

  return (
    <div className="sticky top-0 z-30 border-b border-emerald-950/40 bg-[#030805]/75 backdrop-blur-xl">
      <div className="h-20 px-6 flex items-center justify-between">
        
        {/* LEFT SECTION */}
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden text-slate-300 hover:text-white p-1.5 rounded-lg border border-emerald-950/40 hover:border-emerald-500/20 transition-all focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h2 className="text-xl font-bold tracking-tight text-white leading-none">
              {title}
            </h2>
            <p className="text-slate-500 text-xs mt-1.5 font-medium">
              {subtitle}
            </p>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-4">
          
          {/* NOTIFICATION HUB */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setOpenNotification(!openNotification)}
              className={`
                relative
                bg-emerald-950/20
                border border-emerald-500/10
                p-2.5
                rounded-xl
                hover:bg-emerald-950/40
                hover:border-emerald-500/25
                text-slate-300
                hover:text-emerald-400
                transition-all
                duration-200
                focus:outline-none
                ${openNotification ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/25" : ""}
              `}
            >
              <Bell className="w-4.5 h-4.5" />

              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 min-w-[18px] h-4.5 px-1 rounded-full bg-red-500 flex items-center justify-center text-[9px] font-bold text-white shadow-sm shadow-red-500/20 animate-pulse">
                  {unreadCount}
                </div>
              )}
            </button>

            {/* NOTIFICATION DROPDOWN */}
            {openNotification && (
              <div className="absolute right-0 mt-3 w-[360px] bg-[#050f09] border border-emerald-500/20 rounded-2xl shadow-2xl overflow-hidden z-50">
                {/* DROPDOWN HEADER */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-emerald-500/10 bg-[#08150d]/50">
                  <div>
                    <h3 className="font-bold text-sm text-white">Notifications</h3>
                    <p className="text-[10px] text-slate-500 font-semibold tracking-wide uppercase mt-0.5">
                      {unreadCount} Actions Pending
                    </p>
                  </div>

                  <button
                    onClick={() => setOpenNotification(false)}
                    className="text-slate-500 hover:text-white p-1 rounded-lg hover:bg-emerald-950/40 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* DROPDOWN BODY */}
                <div className="max-h-[400px] overflow-y-auto p-4 space-y-2.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {loading ? (
                    <div className="text-center py-10 text-xs text-slate-500 font-medium">
                      <div className="h-4 w-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      Syncing messages...
                    </div>
                  ) : notifications.length > 0 ? (
                    notifications.map((item) => (
                      <div
                        key={item._id}
                        className={`
                          rounded-xl
                          border
                          p-4.5
                          transition-all
                          duration-200
                          ${
                            item.isRead
                              ? "bg-emerald-950/5 border-emerald-500/5 hover:border-emerald-500/10"
                              : "bg-emerald-950/20 border-emerald-500/15"
                          }
                        `}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-xs font-bold ${item.isRead ? "text-slate-300" : "text-white"}`}>
                              {item.title}
                            </h4>
                            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                              {item.message}
                            </p>

                            {item.createdAt && (
                              <span className="text-[9px] text-slate-500 font-medium block mt-2.5">
                                {new Date(item.createdAt).toLocaleString()}
                              </span>
                            )}
                          </div>

                          {!item.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(item._id)}
                              className="text-emerald-400 hover:text-emerald-300 p-1 rounded-lg hover:bg-emerald-500/10 transition shrink-0"
                              title="Mark as read"
                            >
                              <CheckCheck className="w-4.5 h-4.5" />
                            </button>
                          )}
                        </div>

                        <div className="flex justify-end pt-3 mt-3 border-t border-emerald-500/5">
                          <button
                            onClick={() => handleDeleteNotification(item._id)}
                            className="flex items-center gap-1.5 text-red-400/80 hover:text-red-400 text-[10px] font-bold tracking-wider uppercase transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/5 flex items-center justify-center mx-auto mb-3.5 border border-emerald-500/10">
                        <Bell className="w-5 h-5 text-slate-500" />
                      </div>
                      <h4 className="text-white text-xs font-bold">No Notifications</h4>
                      <p className="text-[11px] text-slate-500 mt-1">
                        You're all caught up for the day.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* USER PROFILE DROPDOWN / SNAPSHOT */}
          <div className="flex items-center gap-3 bg-[#050f09]/60 border border-emerald-500/10 rounded-xl px-3.5 py-1.5 shadow-sm">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 text-black font-extrabold text-sm flex items-center justify-center shadow-sm shadow-emerald-500/10 shrink-0">
              {profile?.name?.charAt(0)?.toUpperCase() || (
                <User className="w-4 h-4 text-black" />
              )}
            </div>

            <div className="hidden md:block text-left min-w-0">
              <h3 className="text-xs font-bold text-white truncate leading-none">
                {profile?.name || "User"}
              </h3>
              <span className="text-[10px] text-slate-500 mt-1 block truncate max-w-[120px]">
                {profile?.email || "syncing..."}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
