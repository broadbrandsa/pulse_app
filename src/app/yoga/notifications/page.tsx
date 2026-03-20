"use client";

import { useState } from "react";
import {
    Bell01,
    Calendar,
    Users01,
    Trophy01,
    Clock,
    Check,
    Star01,
    AlertCircle,
} from "@untitledui/icons";

// -- Types ------------------------------------------------------------------------

type NotificationType = "booking" | "waitlist" | "membership" | "streak" | "reminder" | "system" | "loyalty" | "class";

type Notification = {
    id: number;
    type: NotificationType;
    title: string;
    message: string;
    time: string;
    read: boolean;
};

// -- Mock Data --------------------------------------------------------------------

const initialNotifications: Notification[] = [
    {
        id: 1,
        type: "booking",
        title: "Booking Confirmed",
        message: "Kefilwe Molefe booked Morning Vinyasa for tomorrow at 06:30.",
        time: "10 min ago",
        read: false,
    },
    {
        id: 2,
        type: "waitlist",
        title: "Waitlist Alert",
        message: "A spot opened up in Saturday\u2019s Yin Yoga class. 2 students on the waitlist have been notified.",
        time: "25 min ago",
        read: false,
    },
    {
        id: 3,
        type: "membership",
        title: "Membership Renewal",
        message: "Lerato Phiri\u2019s Monthly Unlimited membership renews in 3 days. Payment method on file.",
        time: "1h ago",
        read: false,
    },
    {
        id: 4,
        type: "streak",
        title: "Streak Achievement",
        message: "Amahle Nkosi has reached a 30-day streak! +200 loyalty points awarded automatically.",
        time: "2h ago",
        read: true,
    },
    {
        id: 5,
        type: "class",
        title: "Class Almost Full",
        message: "Wednesday Evening Flow has 1 spot remaining. Consider opening a second session.",
        time: "3h ago",
        read: true,
    },
    {
        id: 6,
        type: "loyalty",
        title: "Points Redeemed",
        message: "Priya Chetty redeemed 500 points for a free class. Balance: 3,100 pts.",
        time: "5h ago",
        read: true,
    },
    {
        id: 7,
        type: "reminder",
        title: "Class Reminder Sent",
        message: "Automated reminders sent to 18 students for tomorrow\u2019s classes.",
        time: "Yesterday",
        read: true,
    },
    {
        id: 8,
        type: "system",
        title: "Pass Expiring",
        message: "Zanele Mthembu\u2019s 5-Class Pass expires in 5 days with 2 classes remaining.",
        time: "Yesterday",
        read: true,
    },
];

// -- Helpers ----------------------------------------------------------------------

function notifIcon(type: NotificationType) {
    const configs: Record<NotificationType, { icon: React.FC<React.SVGProps<SVGSVGElement>>; color: string; bg: string }> = {
        booking: { icon: Calendar, color: "#14B8A6", bg: "bg-[#14B8A6]/15" },
        waitlist: { icon: Users01, color: "#F59E0B", bg: "bg-[#F59E0B]/15" },
        membership: { icon: Star01, color: "#7C3AED", bg: "bg-[#7C3AED]/15" },
        streak: { icon: Trophy01, color: "#F59E0B", bg: "bg-[#F59E0B]/15" },
        reminder: { icon: Clock, color: "#3B82F6", bg: "bg-[#3B82F6]/15" },
        system: { icon: AlertCircle, color: "#EF4444", bg: "bg-[#EF4444]/15" },
        loyalty: { icon: Star01, color: "#14B8A6", bg: "bg-[#14B8A6]/15" },
        class: { icon: Users01, color: "#F59E0B", bg: "bg-[#F59E0B]/15" },
    };
    const c = configs[type];
    const Icon = c.icon;
    return (
        <div className={`flex size-10 shrink-0 items-center justify-center rounded-full ${c.bg}`}>
            <Icon className="size-5" style={{ color: c.color }} />
        </div>
    );
}

// -- Page Component ---------------------------------------------------------------

export default function YogaNotificationsPage() {
    const [notifications, setNotifications] = useState(initialNotifications);
    const [filter, setFilter] = useState<"all" | "unread">("all");

    const unreadCount = notifications.filter((n) => !n.read).length;
    const filtered = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

    const markAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const toggleRead = (id: number) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)),
        );
    };

    return (
        <div className="min-h-screen bg-[var(--pa-bg-base)] px-4 py-6 lg:px-6 lg:py-8">
            <div className="mx-auto max-w-3xl space-y-4 lg:space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-[#14B8A6]/15">
                            <Bell01 className="size-5 text-[#14B8A6]" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-[var(--pa-text-primary)] lg:text-2xl">
                                Notifications
                            </h1>
                            <p className="text-sm text-[var(--pa-text-secondary)]">
                                Stay updated on studio activity
                            </p>
                        </div>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllRead}
                            className="inline-flex items-center gap-2 self-start rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] px-4 py-2 text-sm font-medium text-[var(--pa-text-secondary)] transition duration-100 ease-linear hover:text-[var(--pa-text-primary)]"
                        >
                            <Check className="size-4" />
                            Mark all read
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setFilter("all")}
                        className={`rounded-xl px-4 py-2 text-sm font-medium transition duration-100 ease-linear ${
                            filter === "all"
                                ? "bg-[#14B8A6] text-white"
                                : "text-[var(--pa-text-muted)] hover:bg-[var(--pa-bg-elevated)] hover:text-[var(--pa-text-primary)]"
                        }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter("unread")}
                        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition duration-100 ease-linear ${
                            filter === "unread"
                                ? "bg-[#14B8A6] text-white"
                                : "text-[var(--pa-text-muted)] hover:bg-[var(--pa-bg-elevated)] hover:text-[var(--pa-text-primary)]"
                        }`}
                    >
                        Unread
                        {unreadCount > 0 && (
                            <span className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                                filter === "unread" ? "bg-white/20 text-white" : "bg-[#14B8A6] text-white"
                            }`}>
                                {unreadCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* Notification List */}
                <div className="space-y-2">
                    {filtered.map((notif) => (
                        <button
                            key={notif.id}
                            onClick={() => toggleRead(notif.id)}
                            className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition duration-100 ease-linear ${
                                notif.read
                                    ? "border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)]"
                                    : "border-[#14B8A6]/30 bg-[#14B8A6]/5"
                            } hover:bg-[var(--pa-bg-elevated)]`}
                        >
                            {notifIcon(notif.type)}
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-semibold text-[var(--pa-text-primary)]">
                                        {notif.title}
                                    </h3>
                                    {!notif.read && (
                                        <span className="size-2 rounded-full bg-[#14B8A6]" />
                                    )}
                                </div>
                                <p className="mt-0.5 text-sm text-[var(--pa-text-secondary)]">
                                    {notif.message}
                                </p>
                                <p className="mt-1.5 text-xs text-[var(--pa-text-muted)]">{notif.time}</p>
                            </div>
                        </button>
                    ))}

                    {filtered.length === 0 && (
                        <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-12 text-center">
                            <Bell01 className="mx-auto mb-3 size-10 text-[var(--pa-bg-elevated)]" />
                            <p className="text-sm text-[var(--pa-text-muted)]">No notifications</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
