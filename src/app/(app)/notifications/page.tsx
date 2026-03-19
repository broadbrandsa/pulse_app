"use client";

import { useState } from "react";

type NotificationType = "booking" | "payment" | "client" | "system";
type Notification = {
  id: string; type: NotificationType; title: string; description: string;
  time: string; read: boolean; avatar?: string;
};

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "booking", title: "New Booking", description: "Thando Nkosi booked a 1-on-1 session for tomorrow at 7:00 AM.", time: "2 min ago", read: false, avatar: "TN" },
  { id: "n2", type: "payment", title: "Payment Received", description: "R650 received from Lerato Mokoena for Personal Training.", time: "1 hour ago", read: false, avatar: "LM" },
  { id: "n3", type: "client", title: "New Client Registered", description: "Ryan Govender signed up via your booking page.", time: "3 hours ago", read: false, avatar: "RG" },
  { id: "n4", type: "booking", title: "Session Cancelled", description: "James van der Merwe cancelled Friday's session.", time: "5 hours ago", read: true, avatar: "JM" },
  { id: "n5", type: "payment", title: "Payment Overdue", description: "Naledi Phiri's monthly subscription is 3 days overdue.", time: "1 day ago", read: true, avatar: "NP" },
  { id: "n6", type: "system", title: "Weekly Report Ready", description: "Your weekly performance report is now available.", time: "1 day ago", read: true },
  { id: "n7", type: "client", title: "Client Milestone", description: "Aisha Patel completed 50 sessions with you!", time: "2 days ago", read: true, avatar: "AP" },
  { id: "n8", type: "booking", title: "Booking Reminder", description: "You have 3 sessions scheduled for tomorrow.", time: "2 days ago", read: true },
];

const TABS = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "booking", label: "Bookings" },
  { key: "payment", label: "Payments" },
  { key: "client", label: "Clients" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const typeIcons: Record<NotificationType, { bg: string; icon: string }> = {
  booking: { bg: "bg-[#5A4EFF]/20", icon: "text-[#5A4EFF]" },
  payment: { bg: "bg-[#E2F4A6]/20", icon: "text-[#E2F4A6]" },
  client: { bg: "bg-[#EEA0FF]/20", icon: "text-[#EEA0FF]" },
  system: { bg: "bg-[#A1A1AA]/20", icon: "text-[#A1A1AA]" },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !n.read;
    return n.type === activeTab;
  });

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const toggleRead = (id: string) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: !n.read } : n));

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA]">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            {unreadCount > 0 && <p className="text-sm text-[#A1A1AA] mt-1">{unreadCount} unread</p>}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-sm text-[#5A4EFF] hover:text-[#4840E8] font-medium transition duration-100 ease-linear">
              Mark all read
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {TABS.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap font-medium transition duration-100 ease-linear ${
              activeTab === tab.key ? "bg-[#5A4EFF] text-white" : "bg-[#111111] border border-[#262626] text-[#A1A1AA] hover:text-[#FAFAFA]"
            }`}>
              {tab.label}
              {tab.key === "unread" && unreadCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-white/20 text-xs">{unreadCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-[#71717A]">
              <svg className="w-10 h-10 mx-auto mb-3 text-[#262626]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <p>No notifications</p>
            </div>
          ) : (
            filtered.map((n) => (
              <button key={n.id} onClick={() => toggleRead(n.id)} className={`w-full text-left p-4 rounded-2xl border transition duration-100 ease-linear ${
                n.read ? "bg-[#111111] border-[#262626]" : "bg-[#5A4EFF]/5 border-[#5A4EFF]/20"
              }`}>
                <div className="flex gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${typeIcons[n.type].bg}`}>
                    {n.avatar ? (
                      <span className={`text-sm font-medium ${typeIcons[n.type].icon}`}>{n.avatar}</span>
                    ) : (
                      <svg className={`w-5 h-5 ${typeIcons[n.type].icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm text-[#FAFAFA]">{n.title}</p>
                      {!n.read && <div className="w-2 h-2 rounded-full bg-[#5A4EFF] shrink-0" />}
                    </div>
                    <p className="text-sm text-[#A1A1AA] mt-0.5">{n.description}</p>
                    <p className="text-xs text-[#71717A] mt-1">{n.time}</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}