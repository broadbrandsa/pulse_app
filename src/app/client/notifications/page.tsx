"use client";

import { useState } from "react";
import {
  Calendar,
  Trophy01,
  Star01,
  Activity,
  Award01,
  MessageSquare02,
  CreditCard02,
  Heart,
  Check,
} from "@untitledui/icons";

/* ─── mock data ─── */
interface Notification {
  id: number;
  type: "session" | "milestone" | "points" | "workout" | "loyalty" | "message" | "credits" | "welcome";
  title: string;
  body: string;
  time: string;
  read: boolean;
  action?: string;
}

const initialNotifs: Notification[] = [
  {
    id: 1,
    type: "session",
    title: "Session Tomorrow",
    body: "PT with Sipho at 10:00, PT Home Studio. Remember to bring water!",
    time: "2h ago",
    read: false,
    action: "View session",
  },
  {
    id: 2,
    type: "milestone",
    title: "New Milestone!",
    body: "You completed 20 sessions this quarter. Keep it up!",
    time: "5h ago",
    read: false,
  },
  {
    id: 3,
    type: "points",
    title: "Points Earned",
    body: "+40 points for attending your PT session today.",
    time: "1d ago",
    read: false,
    action: "View rewards",
  },
  {
    id: 4,
    type: "workout",
    title: "New Programme Ready",
    body: "Sipho has updated your training programme for this week.",
    time: "1d ago",
    read: true,
    action: "View programme",
  },
  {
    id: 5,
    type: "loyalty",
    title: "Gold Tier Unlocked!",
    body: "You've reached Gold tier. Enjoy priority booking and 10% retail discount.",
    time: "3d ago",
    read: true,
  },
  {
    id: 6,
    type: "message",
    title: "Message from Sipho",
    body: "Great session today! Let's push harder next week on deadlifts.",
    time: "3d ago",
    read: true,
  },
  {
    id: 7,
    type: "credits",
    title: "Sessions Running Low",
    body: "You have 4 of 10 sessions remaining. Top up to stay on track.",
    time: "5d ago",
    read: true,
    action: "Top up",
  },
  {
    id: 8,
    type: "welcome",
    title: "Welcome to PulseApp!",
    body: "You're all set. Book your first session and start earning rewards.",
    time: "2w ago",
    read: true,
  },
];

const typeConfig: Record<string, { dot: string; icon: React.FC<{ className?: string }> }> = {
  session: { dot: "bg-emerald-400", icon: Calendar },
  milestone: { dot: "bg-amber-400", icon: Trophy01 },
  points: { dot: "bg-[#EEA0FF]", icon: Star01 },
  workout: { dot: "bg-blue-400", icon: Activity },
  loyalty: { dot: "bg-amber-400", icon: Award01 },
  message: { dot: "bg-blue-400", icon: MessageSquare02 },
  credits: { dot: "bg-red-400", icon: CreditCard02 },
  welcome: { dot: "bg-[#E2F4A6]", icon: Heart },
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(initialNotifs);

  const unreadCount = notifs.filter((n) => !n.read).length;

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  const toggleRead = (id: number) =>
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));

  return (
    <div className="px-4 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-[#FAFAFA]">Notifications</h1>
          {unreadCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#5A4EFF] px-1.5 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-xs font-medium text-[#5A4EFF] transition hover:underline">
            Mark all read
          </button>
        )}
      </div>

      {/* Notification list */}
      <div className="space-y-2">
        {notifs.map((n) => {
          const config = typeConfig[n.type];
          const Icon = config.icon;
          return (
            <button
              key={n.id}
              onClick={() => toggleRead(n.id)}
              className={`relative w-full rounded-xl border p-4 text-left transition ${
                n.read
                  ? "border-[#262626] bg-[#141414]"
                  : "border-l-2 border-[#5A4EFF] bg-[#5A4EFF]/5"
              }`}
            >
              <div className="flex gap-3">
                <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1A1A1A]">
                  <Icon className="size-4 text-[#A1A1AA]" />
                  <span className={`absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ${config.dot} ring-2 ring-[#141414]`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold ${n.read ? "text-[#A1A1AA]" : "text-[#FAFAFA]"}`}>{n.title}</p>
                    <span className="shrink-0 text-[11px] text-[#52525B]">{n.time}</span>
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed text-[#71717A]">{n.body}</p>
                  {n.action && (
                    <span className="mt-2 inline-block rounded-lg bg-[#1A1A1A] px-3 py-1.5 text-xs font-medium text-[#5A4EFF]">
                      {n.action}
                    </span>
                  )}
                </div>
              </div>
              {!n.read && (
                <span className="absolute top-4 right-4 h-2 w-2 rounded-full bg-[#5A4EFF]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
