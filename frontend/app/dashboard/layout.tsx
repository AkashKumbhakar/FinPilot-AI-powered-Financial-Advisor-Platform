"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import api from "@/lib/axios";
import socket from "@/lib/socket";

interface NotificationData {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  // FETCH NOTIFICATIONS
  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notification/all");
      setNotifications(res.data.data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // SOCKET SETUP
  useEffect(() => {
    const setupSocket = async () => {
      try {
        const res = await api.get("/user/profile");
        const user = res.data.data;

        // REGISTER USER
        socket.emit("registerUser", user._id);
      } catch (error) {
        console.error("Error establishing socket registration:", error);
      }
    };

    setupSocket();

    // RECEIVE REALTIME NOTIFICATIONS
    socket.on("newNotification", (notification: NotificationData) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.off("newNotification");
    };
  }, []);

  // MARK AS READ
  const markAsRead = async (id: string) => {
    try {
      await api.put(`/notification/read/${id}`);
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
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // DELETE NOTIFICATION
  const deleteNotification = async (id: string) => {
    try {
      await api.delete(`/notification/delete/${id}`);
      setNotifications((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <main className="h-screen bg-[#030805] text-[#E2E8F0] flex overflow-hidden font-sans relative">
      
      {/* GLOBAL BACKGROUND GLOWS FOR ALL DASHBOARD PAGES */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* SIDEBAR */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* TOPBAR */}
        <Topbar
          title="Dashboard"
          subtitle="AI-powered financial overview"
          setSidebarOpen={setSidebarOpen}
          notifications={notifications}
          markAsRead={markAsRead}
          deleteNotification={deleteNotification}
        />

        {/* PAGE CONTENT CONTAINER (WITH HIDDEN SCROLLBARS) */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </div>

      </div>
    </main>
  );
}
