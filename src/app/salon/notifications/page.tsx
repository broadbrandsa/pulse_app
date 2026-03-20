"use client";

import { useState } from "react";
import {
    Bell01,
    Calendar,
    AlertTriangle,
    CreditCard01,
    Star01,
    Users01,
    Clock,
    Check,
} from "@untitledui/icons";
import type { FC, SVGProps } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

type NotificationType =
    | "booking"
    | "walk-in"
    | "cancellation"
    | "stock"
    | "payment"
    | "review"
    | "milestone"
    | "reminder";

type Notification = {
    id: number;
    type: NotificationType;
    title: string;
    message: string;
    time: string;
    read: boolean;
};

// ── Mock Data ────────────────────────────────────────────────────────────────

const initialNotifications: Notification[] = [
    { id: 1, type: "booking", title: "New booking", message: "Thandi Mokoena booked Box Braids for Saturday 9am", time: "10 min ago", read: false },
    { id: 2, type: "walk-in", title: "Walk-in added", message: "Walk-in client added to queue (Trim)", time: "25 min ago", read: false },
    { id: 3, type: "cancellation", title: "Cancellation", message: "Sibongile Dube cancelled her Wig Install appointment", time: "1h ago", read: false },
    { id: 4, type: "stock", title: "Low stock alert", message: "Dark & Lovely Hair Colour is running low (1 remaining)", time: "2h ago", read: true },
    { id: 5, type: "payment", title: "Payment received", message: "R850 received from Thandi Mokoena (Card)", time: "3h ago", read: true },
    { id: 6, type: "review", title: "New review", message: "Precious Ndlovu left a 5-star review", time: "5h ago", read: true },
    { id: 7, type: "milestone", title: "Client milestone", message: "Ayanda Khumalo reached Gold tier! \u{1F389}", time: "1d ago", read: true },
    { id: 8, type: "reminder", title: "Upcoming appointment", message: "Tomorrow: 5 appointments starting at 8:00", time: "1d ago", read: true },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

const typeConfig: Record<NotificationType, { icon: FC<SVGProps<SVGSVGElement>>; color: string; bgColor: string }> = {
    booking: { icon: Calendar, color: "#D946EF", bgColor: "bg-[#D946EF]/15" },
    "walk-in": { icon: Users01, color: "#14B8A6", bgColor: "bg-[#14B8A6]/15" },
    cancellation: { icon: AlertTriangle, color: "#EF4444", bgColor: "bg-[#EF4444]/15" },
    stock: { icon: AlertTriangle, color: "#F59E0B", bgColor: "bg-[#F59E0B]/15" },
    payment: { icon: CreditCard01, color: "#22C55E", bgColor: "bg-[#22C55E]/15" },
    review: { icon: Star01, color: "#F59E0B", bgColor: "bg-[#F59E0B]/15" },
    milestone: { icon: Users01, color: "#D946EF", bgColor: "bg-[#D946EF]/15" },
    reminder: { icon: Clock, color: "#3B82F6", bgColor: "bg-[#3B82F6]/15" },
};

// ── Page Component ───────────────────────────────────────────────────────────

export default function SalonNotificationsPage() {
    const [notifications, setNotifications] = useState(initialNotifications);
    const [filter, setFilter] = useState<"all" | "unread">("all");

    const unreadCount = notifications.filter((n) => !n.read).length;

    const displayed = filter === "unread"
        ? notifications.filter((n) => !n.read)
        : notifications;

    const markAsRead = (id: number) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
        );
    };

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    return (
        <div className="min-h-screen bg-[var(--pa-bg-base)] px-4 py-6 lg:px-6 lg:py-8">
            <div className="mx-auto max-w-3xl space-y-4 lg:space-y-6">
                {/* ── Header ──────────────────────────────────────────── */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-[#D946EF]/15">
                            <Bell01 className="size-5 text-[#D946EF]" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-[var(--pa-text-primary)] lg:text-2xl">Notifications</h1>
                            <p className="text-sm text-[var(--pa-text-secondary)]">
                                {unreadCount > 0
                                    ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
                                    : "All caught up!"}
                            </p>
                        </div>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-[#D946EF] transition duration-100 ease-linear hover:bg-[#D946EF]/10"
                        >
                            <Check className="size-4" />
                            Mark all as read
                        </button>
                    )}
                </div>

                {/* ── Filter Tabs ─────────────────────────────────────── */}
                <div className="flex gap-1">
                    <button
                        onClick={() => setFilter("all")}
                        className={`rounded-xl px-4 py-2 text-sm font-medium transition duration-100 ease-linear ${
                            filter === "all"
                                ? "bg-[#D946EF] text-white"
                                : "text-[var(--pa-text-muted)] hover:bg-[var(--pa-bg-elevated)] hover:text-[var(--pa-text-primary)]"
                        }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter("unread")}
                        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition duration-100 ease-linear ${
                            filter === "unread"
                                ? "bg-[#D946EF] text-white"
                                : "text-[var(--pa-text-muted)] hover:bg-[var(--pa-bg-elevated)] hover:text-[var(--pa-text-primary)]"
                        }`}
                    >
                        Unread
                        {unreadCount > 0 && (
                            <span
                                className={`flex size-5 items-center justify-center rounded-full text-xs ${
                                    filter === "unread"
                                        ? "bg-white/20 text-white"
                                        : "bg-[#D946EF] text-white"
                                }`}
                            >
                                {unreadCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* ── Notification Cards ──────────────────────────────── */}
                <div className="space-y-2">
                    {displayed.map((n) => {
                        const config = typeConfig[n.type];
                        const Icon = config.icon;

                        return (
                            <button
                                key={n.id}
                                onClick={() => markAsRead(n.id)}
                                className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition duration-100 ease-linear ${
                                    n.read
                                        ? "border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] hover:bg-[var(--pa-bg-elevated)]"
                                        : "border-[#D946EF]/20 bg-[#D946EF]/5 hover:bg-[#D946EF]/10"
                                }`}
                            >
                                {/* Icon */}
                                <div className={`flex size-10 shrink-0 items-center justify-center rounded-full ${config.bgColor}`}>
                                    <Icon className="size-5" style={{ color: config.color }} />
                                </div>

                                {/* Content */}
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className={`text-sm font-medium ${n.read ? "text-[var(--pa-text-primary)]" : "text-[var(--pa-text-primary)]"}`}>
                                                    {n.title}
                                                </h3>
                                                {!n.read && (
                                                    <span className="size-2 shrink-0 rounded-full bg-[#D946EF]" />
                                                )}
                                            </div>
                                            <p className="mt-0.5 text-sm text-[var(--pa-text-secondary)]">{n.message}</p>
                                        </div>
                                        <span className="shrink-0 text-xs text-[var(--pa-text-muted)]">{n.time}</span>
                                    </div>
                                </div>
                            </button>
                        );
                    })}

                    {displayed.length === 0 && (
                        <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-12 text-center">
                            <Bell01 className="mx-auto mb-3 size-10 text-[#262626]" />
                            <p className="text-sm text-[var(--pa-text-muted)]">
                                {filter === "unread" ? "No unread notifications" : "No notifications yet"}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
