"use client";

import { useState } from "react";
import { ArrowLeft, Calendar, Star01, Gift01, Award01, ShoppingBag01, Check } from "@untitledui/icons";
import Link from "next/link";
import type { FC } from "react";

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: FC<{ className?: string }>;
  iconBg: string;
  iconColor: string;
}

const clientNotifications: Notification[] = [
  {
    id: 1,
    title: "Appointment Confirmed",
    message: "Box Braids with Naledi on Sat 22 Mar at 09:00",
    time: "2h ago",
    read: false,
    icon: Calendar,
    iconBg: "bg-[#D946EF]/15",
    iconColor: "text-[#D946EF]",
  },
  {
    id: 2,
    title: "Points Earned",
    message: "You earned 85 points from your last visit!",
    time: "2d ago",
    read: false,
    icon: Star01,
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-400",
  },
  {
    id: 3,
    title: "Special Offer",
    message: "20% off all treatments this Friday!",
    time: "3d ago",
    read: true,
    icon: Gift01,
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-400",
  },
  {
    id: 4,
    title: "Gold Tier Maintained",
    message: "Congrats! You've maintained Gold status",
    time: "1w ago",
    read: true,
    icon: Award01,
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-400",
  },
  {
    id: 5,
    title: "Product Recommendation",
    message: "Based on your hair profile, try our new deep conditioner",
    time: "1w ago",
    read: true,
    icon: ShoppingBag01,
    iconBg: "bg-sky-500/15",
    iconColor: "text-sky-400",
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(clientNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/salon-client" className="rounded-lg p-1.5 text-[var(--pa-text-secondary)] transition hover:bg-[var(--pa-bg-elevated)] hover:text-[var(--pa-text-primary)]">
            <ArrowLeft className="size-5" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-[var(--pa-text-primary)]">Notifications</h1>
            {unreadCount > 0 && <p className="text-xs text-[var(--pa-text-muted)]">{unreadCount} unread</p>}
          </div>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-1 text-xs font-medium text-[#D946EF] transition hover:text-[#E879F9]">
            <Check className="size-3" />
            Mark all read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {notifications.map((notif) => {
          const Icon = notif.icon;
          return (
            <button
              key={notif.id}
              onClick={() => markRead(notif.id)}
              className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition ${
                notif.read
                  ? "border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)]"
                  : "border-[#D946EF]/20 bg-[#D946EF]/5"
              }`}
            >
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${notif.iconBg}`}>
                <Icon className={`size-4 ${notif.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-sm font-medium ${notif.read ? "text-[var(--pa-text-primary)]" : "text-[var(--pa-text-primary)]"}`}>
                    {notif.title}
                  </p>
                  {!notif.read && <span className="h-2 w-2 shrink-0 rounded-full bg-[#D946EF]" />}
                </div>
                <p className="mt-0.5 text-xs text-[var(--pa-text-secondary)]">{notif.message}</p>
                <p className="mt-1 text-[10px] text-zinc-600">{notif.time}</p>
              </div>
            </button>
          );
        })}
      </div>

      {notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--pa-bg-elevated)]">
            <Check className="size-6 text-zinc-600" />
          </div>
          <p className="text-sm font-medium text-[var(--pa-text-muted)]">All caught up!</p>
          <p className="text-xs text-zinc-600">No new notifications</p>
        </div>
      )}
    </div>
  );
}
