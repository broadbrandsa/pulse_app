"use client";

import Link from "next/link";
import {
    Calendar,
    Clock,
    MarkerPin01,
    MessageChatCircle,
    ChevronRight,
    Trophy01,
    Star01,
    BarChart07,
    NavigationPointer01,
    CheckCircle,
    Activity,
} from "@untitledui/icons";

/* ------------------------------------------------------------------ */
/*  Mock Data (inline)                                                 */
/* ------------------------------------------------------------------ */

const chips = [
    { label: "Next session: Today 10:00", icon: Clock },
    { label: "Sessions left: 4/10", icon: Calendar },
    { label: "Points: 1,240", icon: Star01 },
    { label: "\uD83D\uDD25 12-day streak", icon: null },
];

const exercises = [
    { name: "Barbell Back Squat", sets: "4 \u00D7 12" },
    { name: "Romanian Deadlift", sets: "3 \u00D7 10" },
    { name: "Leg Press", sets: "3 \u00D7 15" },
];

const metrics = [
    {
        label: "Weight",
        value: "73.2kg",
        change: "\u2193 2.1kg",
        accent: "lime",
        sub: "Last 30 days",
    },
    {
        label: "Sessions",
        value: "28",
        change: "\u2191 4",
        accent: "brand",
        sub: "Completed",
    },
    {
        label: "Streak",
        value: "\uD83D\uDD25 12 days",
        change: "Personal best!",
        accent: "lime",
        sub: "",
    },
];

const trainerUpdates = [
    {
        id: 1,
        text: "Great session yesterday! Your squat form has really improved. Keep it up.",
        time: "2 hours ago",
    },
    {
        id: 2,
        text: "I\u2019ve updated your nutrition plan for the week \u2014 check the Nutrition tab.",
        time: "Yesterday",
    },
    {
        id: 3,
        text: "Remember to foam roll tonight. Recovery is just as important as training!",
        time: "2 days ago",
    },
];

const quickActions = [
    { label: "Book Session", icon: Calendar, href: "/book" },
    { label: "My Workout", icon: Activity, href: "/client/plan" },
    { label: "Message Sipho", icon: MessageChatCircle, href: "#" },
    { label: "My Progress", icon: BarChart07, href: "/client/progress" },
];

/* ------------------------------------------------------------------ */
/*  Card wrapper                                                       */
/* ------------------------------------------------------------------ */

function Card({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`bg-[#111111] border border-[#262626] rounded-2xl p-6 ${className}`}
        >
            {children}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ClientHomePage() {
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white">
            <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
                {/* ====== 1. Hero Greeting ====== */}
                <section>
                    <h1 className="text-3xl font-semibold tracking-tight">
                        Good morning, Kefilwe
                    </h1>
                    <p className="mt-1 text-[#A1A1AA] text-sm">
                        Thursday, 19 March
                    </p>

                    {/* Chip strip */}
                    <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {chips.map((chip) => (
                            <span
                                key={chip.label}
                                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#262626] bg-[#111111] px-3 py-1.5 text-xs font-medium text-[#E4E4E7]"
                            >
                                {chip.icon && (
                                    <chip.icon className="size-3.5 text-[#5A4EFF]" />
                                )}
                                {chip.label}
                            </span>
                        ))}
                    </div>
                </section>

                {/* ====== 2. Today's Session Card ====== */}
                <Card className="border-l-4 border-l-[#5A4EFF]">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-[#5A4EFF]">
                                Today&apos;s Session
                            </p>
                            <h2 className="mt-2 text-xl font-semibold">
                                Personal Training
                            </h2>
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#E2F4A6]/10 px-2.5 py-1 text-xs font-medium text-[#E2F4A6]">
                            <CheckCircle className="size-3.5" />
                            Confirmed
                        </span>
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-[#A1A1AA]">
                        <p className="flex items-center gap-2">
                            <Clock className="size-4 text-[#5A4EFF]" />
                            10:00 &ndash; 11:00
                        </p>
                        <p className="flex items-center gap-2">
                            <MarkerPin01 className="size-4 text-[#5A4EFF]" />
                            Home Studio, 24 Kloof Street, Cape Town
                        </p>
                        <p className="flex items-center gap-2">
                            <span className="inline-flex size-4 items-center justify-center rounded-full bg-[#5A4EFF] text-[9px] font-bold text-white">
                                SD
                            </span>
                            with Sipho Dlamini
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 flex gap-3">
                        <Link
                            href="#"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#5A4EFF] px-4 py-2 text-sm font-medium text-white transition duration-100 ease-linear hover:bg-[#4940D9]"
                        >
                            <NavigationPointer01 className="size-4" />
                            Get Directions
                        </Link>
                        <Link
                            href="#"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#262626] bg-[#111111] px-4 py-2 text-sm font-medium text-[#E4E4E7] transition duration-100 ease-linear hover:bg-[#1A1A1A]"
                        >
                            <MessageChatCircle className="size-4" />
                            Message Sipho
                        </Link>
                    </div>

                    {/* Pre-session tip */}
                    <div className="mt-4 rounded-lg bg-[#5A4EFF]/5 border border-[#5A4EFF]/10 px-4 py-3">
                        <p className="text-xs text-[#A1A1AA]">
                            <span className="font-medium text-[#5A4EFF]">
                                Pre-session tip:
                            </span>{" "}
                            Have a light snack 30&ndash;60 min before. Bring
                            water and your foam roller.
                        </p>
                    </div>
                </Card>

                {/* ====== 3. Today's Workout Preview ====== */}
                <Card>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#EEA0FF]">
                        Today&apos;s Workout
                    </p>
                    <h3 className="mt-2 text-lg font-semibold">
                        12-Week Body Transformation
                    </h3>
                    <p className="text-sm text-[#A1A1AA]">
                        Week 4, Day 2
                    </p>

                    <div className="mt-4 space-y-3">
                        {exercises.map((ex, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between rounded-lg bg-[#0A0A0A] px-4 py-3"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="flex size-7 items-center justify-center rounded-full bg-[#5A4EFF]/10 text-xs font-bold text-[#5A4EFF]">
                                        {i + 1}
                                    </span>
                                    <span className="text-sm font-medium text-[#E4E4E7]">
                                        {ex.name}
                                    </span>
                                </div>
                                <span className="text-sm text-[#A1A1AA]">
                                    {ex.sets}
                                </span>
                            </div>
                        ))}
                    </div>

                    <Link
                        href="/client/plan"
                        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#5A4EFF] transition duration-100 ease-linear hover:text-[#4940D9]"
                    >
                        View Full Workout
                        <ChevronRight className="size-4" />
                    </Link>

                    {/* Trainer note */}
                    <div className="mt-4 rounded-lg bg-[#EEA0FF]/5 border border-[#EEA0FF]/10 px-4 py-3">
                        <p className="text-xs text-[#A1A1AA]">
                            <span className="font-medium text-[#EEA0FF]">
                                Sipho says:
                            </span>{" "}
                            &ldquo;Push hard today Kefilwe &mdash; you&rsquo;re
                            halfway through Week 4!&rdquo;
                        </p>
                    </div>
                </Card>

                {/* ====== 4. Progress Snapshot ====== */}
                <section>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#A1A1AA]">
                        Progress Snapshot
                    </h3>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {metrics.map((m) => (
                            <Link
                                key={m.label}
                                href="/client/progress"
                                className="flex min-w-[160px] shrink-0 flex-col rounded-2xl border border-[#262626] bg-[#111111] p-6 transition duration-100 ease-linear hover:border-[#3A3A3A]"
                            >
                                <span className="text-xs text-[#A1A1AA]">
                                    {m.label}
                                </span>
                                <span className="mt-1 text-2xl font-semibold">
                                    {m.value}
                                </span>
                                <span
                                    className={`mt-1 text-xs font-medium ${
                                        m.accent === "lime"
                                            ? "text-[#E2F4A6]"
                                            : "text-[#5A4EFF]"
                                    }`}
                                >
                                    {m.change}
                                </span>
                                {m.sub && (
                                    <span className="text-[10px] text-[#71717A]">
                                        {m.sub}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>
                </section>

                {/* ====== 5. Loyalty & Rewards ====== */}
                <Card>
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500 to-amber-600">
                            <Trophy01 className="size-5 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-[#E4E4E7]">
                                Gold Tier
                            </p>
                            <p className="text-xs text-[#A1A1AA]">
                                1,240 points
                            </p>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-4">
                        <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
                            <span>Gold</span>
                            <span>Platinum</span>
                        </div>
                        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#1A1A1A]">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-amber-500"
                                style={{ width: "82.7%" }}
                            />
                        </div>
                        <p className="mt-1.5 text-xs text-[#71717A]">
                            260 points to Platinum
                        </p>
                    </div>

                    <Link
                        href="#"
                        className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#5A4EFF] transition duration-100 ease-linear hover:text-[#4940D9]"
                    >
                        View rewards
                        <ChevronRight className="size-4" />
                    </Link>
                </Card>

                {/* ====== 6. Quick Actions ====== */}
                <section>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#A1A1AA]">
                        Quick Actions
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {quickActions.map((action) => (
                            <Link
                                key={action.label}
                                href={action.href}
                                className="flex flex-col items-center gap-2 rounded-2xl border border-[#262626] bg-[#111111] p-6 text-center transition duration-100 ease-linear hover:border-[#3A3A3A] hover:bg-[#151515]"
                            >
                                <div className="flex size-10 items-center justify-center rounded-xl bg-[#5A4EFF]/10">
                                    <action.icon className="size-5 text-[#5A4EFF]" />
                                </div>
                                <span className="text-sm font-medium text-[#E4E4E7]">
                                    {action.label}
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* ====== 7. From Sipho ====== */}
                <Card>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-[#A1A1AA]">
                        From Sipho
                    </h3>
                    <div className="mt-4 space-y-4">
                        {trainerUpdates.map((update) => (
                            <div key={update.id} className="flex gap-3">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#5A4EFF]">
                                    <span className="text-xs font-bold text-white">
                                        SD
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-[#E4E4E7]">
                                        {update.text}
                                    </p>
                                    <p className="mt-1 text-xs text-[#71717A]">
                                        {update.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
