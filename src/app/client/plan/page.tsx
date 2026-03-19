"use client";

import { useState } from "react";
import Link from "next/link";
import {
    CheckCircle,
    ChevronDown,
    Clock,
    Download01,
    File06,
    Star01,
    ArrowLeft,
} from "@untitledui/icons";

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const weekDays = [
    { day: "Mon", label: "Upper Body", status: "done" as const },
    { day: "Wed", label: "Lower Body", status: "today" as const },
    { day: "Fri", label: "Cardio & Core", status: "upcoming" as const },
];

const exerciseData = [
    {
        id: 1,
        name: "Barbell Back Squat",
        sets: 4,
        reps: 12,
        rest: "90s",
        weight: "60kg",
        note: "Focus on depth \u2014 aim for parallel or below.",
    },
    {
        id: 2,
        name: "Romanian Deadlift",
        sets: 3,
        reps: 10,
        rest: "90s",
        weight: "50kg",
        note: "Slow eccentric. Feel the stretch in your hamstrings.",
    },
    {
        id: 3,
        name: "Leg Press",
        sets: 3,
        reps: 15,
        rest: "60s",
        weight: "100kg",
        note: "High and wide foot placement for glute emphasis.",
    },
    {
        id: 4,
        name: "Walking Lunges",
        sets: 3,
        reps: 12,
        rest: "60s",
        weight: "16kg DBs",
        note: "Keep your torso upright throughout.",
    },
    {
        id: 5,
        name: "Calf Raises",
        sets: 4,
        reps: 15,
        rest: "45s",
        weight: "Bodyweight",
        note: "Full range of motion. Pause at the top.",
    },
];

const meals = [
    {
        id: 1,
        name: "Breakfast",
        time: "07:00",
        calories: 420,
        protein: 35,
        carbs: 45,
        fat: 12,
        items: [
            "3-egg omelette with spinach & feta",
            "1 slice whole wheat toast",
            "Small banana",
        ],
        eaten: true,
    },
    {
        id: 2,
        name: "Snack 1",
        time: "10:00",
        calories: 220,
        protein: 25,
        carbs: 18,
        fat: 8,
        items: ["Greek yoghurt (150g)", "Handful of almonds", "Blueberries"],
        eaten: true,
    },
    {
        id: 3,
        name: "Lunch",
        time: "13:00",
        calories: 520,
        protein: 42,
        carbs: 55,
        fat: 16,
        items: [
            "Grilled chicken breast (150g)",
            "Brown rice (1 cup cooked)",
            "Mixed green salad with olive oil",
        ],
        eaten: false,
    },
    {
        id: 4,
        name: "Snack 2",
        time: "16:00",
        calories: 280,
        protein: 22,
        carbs: 30,
        fat: 10,
        items: [
            "Protein shake (1 scoop whey + almond milk)",
            "Rice cakes with peanut butter",
        ],
        eaten: false,
    },
    {
        id: 5,
        name: "Dinner",
        time: "19:00",
        calories: 480,
        protein: 38,
        carbs: 50,
        fat: 14,
        items: [
            "Baked salmon fillet (150g)",
            "Sweet potato (medium)",
            "Steamed broccoli & carrots",
        ],
        eaten: false,
    },
];

const resources = [
    {
        id: 1,
        name: "Week 4 Training Guide",
        category: "Training",
        isNew: true,
    },
    {
        id: 2,
        name: "Protein Recipe Book",
        category: "Nutrition",
        isNew: false,
    },
    { id: 3, name: "Recovery Guide", category: "Recovery", isNew: false },
    {
        id: 4,
        name: "Programme Overview",
        category: "General",
        isNew: false,
    },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
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

function DonutSVG({ pct, size = 80 }: { pct: number; size?: number }) {
    const r = 34;
    const circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;
    return (
        <svg width={size} height={size} viewBox="0 0 80 80">
            <circle
                cx="40"
                cy="40"
                r={r}
                fill="none"
                stroke="#262626"
                strokeWidth="8"
            />
            <circle
                cx="40"
                cy="40"
                r={r}
                fill="none"
                stroke="#5A4EFF"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={offset}
                transform="rotate(-90 40 40)"
            />
            <text
                x="40"
                y="44"
                textAnchor="middle"
                fill="white"
                fontSize="16"
                fontWeight="600"
            >
                {pct}%
            </text>
        </svg>
    );
}

function ArcSVG({
    value,
    max,
    color,
}: {
    value: number;
    max: number;
    color: string;
}) {
    const pct = Math.min(value / max, 1);
    const r = 50;
    const circ = 2 * Math.PI * r;
    const offset = circ - pct * circ;
    return (
        <svg width={120} height={120} viewBox="0 0 120 120">
            <circle
                cx="60"
                cy="60"
                r={r}
                fill="none"
                stroke="#262626"
                strokeWidth="10"
            />
            <circle
                cx="60"
                cy="60"
                r={r}
                fill="none"
                stroke={color}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={offset}
                transform="rotate(-90 60 60)"
            />
            <text
                x="60"
                y="55"
                textAnchor="middle"
                fill="white"
                fontSize="22"
                fontWeight="600"
            >
                {value}
            </text>
            <text
                x="60"
                y="72"
                textAnchor="middle"
                fill="#71717A"
                fontSize="11"
            >
                / {max} kcal
            </text>
        </svg>
    );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PlanPage() {
    const [activeTab, setActiveTab] = useState<
        "workout" | "nutrition" | "resources"
    >("workout");
    const [completedExercises, setCompletedExercises] = useState<number[]>([]);
    const [expandedExercise, setExpandedExercise] = useState<number | null>(
        null,
    );
    const [logData, setLogData] = useState<
        Record<number, { weight: string; reps: string; rpe: string }>
    >({});
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [eatenMeals, setEatenMeals] = useState<number[]>(
        meals.filter((m) => m.eaten).map((m) => m.id),
    );
    const [expandedMeal, setExpandedMeal] = useState<number | null>(null);

    const allComplete = completedExercises.length === exerciseData.length;

    const tabs = [
        { id: "workout" as const, label: "Workout" },
        { id: "nutrition" as const, label: "Nutrition" },
        { id: "resources" as const, label: "Resources" },
    ];

    function toggleExercise(id: number) {
        setCompletedExercises((prev) =>
            prev.includes(id)
                ? prev.filter((x) => x !== id)
                : [...prev, id],
        );
    }

    function toggleMeal(id: number) {
        setEatenMeals((prev) =>
            prev.includes(id)
                ? prev.filter((x) => x !== id)
                : [...prev, id],
        );
    }

    function handleDownload(name: string) {
        const content = `PDF placeholder content for: ${name}\n\nThis is a mock PDF file for the PulseApp client portal.`;
        const blob = new Blob([content], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${name.replace(/\s+/g, "-").toLowerCase()}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /* Nutrition computed totals */
    const eatenMealData = meals.filter((m) => eatenMeals.includes(m.id));
    const totalCal = eatenMealData.reduce((s, m) => s + m.calories, 0);
    const totalProt = eatenMealData.reduce((s, m) => s + m.protein, 0);
    const totalCarbs = eatenMealData.reduce((s, m) => s + m.carbs, 0);
    const totalFat = eatenMealData.reduce((s, m) => s + m.fat, 0);

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white">
            <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
                {/* Back nav */}
                <Link
                    href="/client"
                    className="inline-flex items-center gap-1.5 text-sm text-[#A1A1AA] transition duration-100 ease-linear hover:text-white"
                >
                    <ArrowLeft className="size-4" />
                    Back to Home
                </Link>

                <h1 className="text-2xl font-semibold tracking-tight">
                    My Plan
                </h1>

                {/* Tab strip */}
                <div className="flex gap-1 rounded-xl bg-[#111111] border border-[#262626] p-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition duration-100 ease-linear ${
                                activeTab === tab.id
                                    ? "bg-[#5A4EFF] text-white"
                                    : "text-[#A1A1AA] hover:text-white"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ============================================================ */}
                {/*  WORKOUT TAB                                                  */}
                {/* ============================================================ */}
                {activeTab === "workout" && (
                    <div className="space-y-6">
                        {/* Header */}
                        <Card>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold">
                                        12-Week Body Transformation
                                    </h2>
                                    <p className="mt-1 text-sm text-[#A1A1AA]">
                                        Week 4 of 12 &middot; Day 2 of 3
                                    </p>
                                </div>
                                <DonutSVG pct={33} />
                            </div>
                        </Card>

                        {/* Week strip */}
                        <div className="flex gap-3">
                            {weekDays.map((d) => (
                                <div
                                    key={d.day}
                                    className={`flex flex-1 flex-col items-center rounded-xl border p-4 text-center ${
                                        d.status === "today"
                                            ? "border-[#5A4EFF] bg-[#5A4EFF]/10"
                                            : "border-[#262626] bg-[#111111]"
                                    }`}
                                >
                                    <span className="text-xs font-semibold uppercase text-[#A1A1AA]">
                                        {d.day}
                                    </span>
                                    <span
                                        className={`mt-1 text-sm font-medium ${
                                            d.status === "today"
                                                ? "text-[#5A4EFF]"
                                                : "text-[#E4E4E7]"
                                        }`}
                                    >
                                        {d.label}
                                    </span>
                                    {d.status === "done" && (
                                        <CheckCircle className="mt-1.5 size-4 text-[#E2F4A6]" />
                                    )}
                                    {d.status === "today" && (
                                        <span className="mt-1.5 text-[10px] font-semibold uppercase text-[#5A4EFF]">
                                            Today
                                        </span>
                                    )}
                                    {d.status === "upcoming" && (
                                        <span className="mt-1.5 text-[10px] text-[#71717A]">
                                            Upcoming
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Completion banner */}
                        {allComplete && (
                            <div className="rounded-2xl border border-[#E2F4A6]/20 bg-[#E2F4A6]/5 p-6 text-center">
                                <p className="text-lg font-semibold text-[#E2F4A6]">
                                    Workout complete! \uD83C\uDF89
                                </p>
                                <p className="mt-1 text-sm text-[#E2F4A6]/80">
                                    +40 points earned
                                </p>

                                {/* Star rating */}
                                <div className="mt-4 flex justify-center gap-2">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => setRating(s)}
                                            className="transition duration-100 ease-linear"
                                        >
                                            <Star01
                                                className={`size-7 ${
                                                    s <= rating
                                                        ? "text-[#E2F4A6] fill-[#E2F4A6]"
                                                        : "text-[#3A3A3A]"
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>

                                <textarea
                                    value={feedback}
                                    onChange={(e) =>
                                        setFeedback(e.target.value)
                                    }
                                    placeholder="How did the workout feel? Leave Sipho a note..."
                                    className="mt-4 w-full rounded-xl border border-[#262626] bg-[#0A0A0A] px-4 py-3 text-sm text-white placeholder-[#71717A] outline-none focus:border-[#5A4EFF]"
                                    rows={3}
                                />
                            </div>
                        )}

                        {/* Exercise list */}
                        <div className="space-y-3">
                            {exerciseData.map((ex) => {
                                const done =
                                    completedExercises.includes(ex.id);
                                const expanded = expandedExercise === ex.id;
                                const log = logData[ex.id] || {
                                    weight: "",
                                    reps: "",
                                    rpe: "",
                                };

                                return (
                                    <Card
                                        key={ex.id}
                                        className={
                                            done
                                                ? "border-[#E2F4A6]/20"
                                                : ""
                                        }
                                    >
                                        <div className="flex items-start gap-3">
                                            {/* Checkbox */}
                                            <button
                                                onClick={() =>
                                                    toggleExercise(ex.id)
                                                }
                                                className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md border transition duration-100 ease-linear ${
                                                    done
                                                        ? "border-[#E2F4A6] bg-[#E2F4A6]"
                                                        : "border-[#3A3A3A] hover:border-[#5A4EFF]"
                                                }`}
                                            >
                                                {done && (
                                                    <svg
                                                        width="14"
                                                        height="14"
                                                        viewBox="0 0 14 14"
                                                        fill="none"
                                                    >
                                                        <path
                                                            d="M3 7.5L5.5 10L11 4"
                                                            stroke="#0A0A0A"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                )}
                                            </button>

                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="flex size-6 items-center justify-center rounded-full bg-[#5A4EFF]/10 text-xs font-bold text-[#5A4EFF]">
                                                        {ex.id}
                                                    </span>
                                                    <h4
                                                        className={`text-sm font-semibold ${done ? "text-[#71717A] line-through" : "text-[#E4E4E7]"}`}
                                                    >
                                                        {ex.name}
                                                    </h4>
                                                </div>

                                                <div className="mt-2 flex flex-wrap gap-3 text-xs text-[#A1A1AA]">
                                                    <span>
                                                        {ex.sets} &times;{" "}
                                                        {ex.reps}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="size-3" />
                                                        {ex.rest} rest
                                                    </span>
                                                    <span>
                                                        {ex.weight} suggested
                                                    </span>
                                                </div>

                                                {/* Trainer note */}
                                                <p className="mt-2 text-xs italic text-[#EEA0FF]/70">
                                                    {ex.note}
                                                </p>

                                                {/* Log results toggle */}
                                                <button
                                                    onClick={() =>
                                                        setExpandedExercise(
                                                            expanded
                                                                ? null
                                                                : ex.id,
                                                        )
                                                    }
                                                    className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[#5A4EFF] transition duration-100 ease-linear hover:text-[#4940D9]"
                                                >
                                                    Log results
                                                    <ChevronDown
                                                        className={`size-3 transition duration-100 ease-linear ${expanded ? "rotate-180" : ""}`}
                                                    />
                                                </button>

                                                {expanded && (
                                                    <div className="mt-3 grid grid-cols-3 gap-2">
                                                        <div>
                                                            <label className="block text-[10px] uppercase text-[#71717A]">
                                                                Weight
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={
                                                                    log.weight
                                                                }
                                                                onChange={(
                                                                    e,
                                                                ) =>
                                                                    setLogData(
                                                                        (
                                                                            prev,
                                                                        ) => ({
                                                                            ...prev,
                                                                            [ex.id]:
                                                                                {
                                                                                    ...log,
                                                                                    weight: e
                                                                                        .target
                                                                                        .value,
                                                                                },
                                                                        }),
                                                                    )
                                                                }
                                                                placeholder="kg"
                                                                className="mt-1 w-full rounded-lg border border-[#262626] bg-[#0A0A0A] px-3 py-2 text-sm text-white placeholder-[#3A3A3A] outline-none focus:border-[#5A4EFF]"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[10px] uppercase text-[#71717A]">
                                                                Reps
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={
                                                                    log.reps
                                                                }
                                                                onChange={(
                                                                    e,
                                                                ) =>
                                                                    setLogData(
                                                                        (
                                                                            prev,
                                                                        ) => ({
                                                                            ...prev,
                                                                            [ex.id]:
                                                                                {
                                                                                    ...log,
                                                                                    reps: e
                                                                                        .target
                                                                                        .value,
                                                                                },
                                                                        }),
                                                                    )
                                                                }
                                                                placeholder="#"
                                                                className="mt-1 w-full rounded-lg border border-[#262626] bg-[#0A0A0A] px-3 py-2 text-sm text-white placeholder-[#3A3A3A] outline-none focus:border-[#5A4EFF]"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[10px] uppercase text-[#71717A]">
                                                                RPE
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={
                                                                    log.rpe
                                                                }
                                                                onChange={(
                                                                    e,
                                                                ) =>
                                                                    setLogData(
                                                                        (
                                                                            prev,
                                                                        ) => ({
                                                                            ...prev,
                                                                            [ex.id]:
                                                                                {
                                                                                    ...log,
                                                                                    rpe: e
                                                                                        .target
                                                                                        .value,
                                                                                },
                                                                        }),
                                                                    )
                                                                }
                                                                placeholder="1-10"
                                                                className="mt-1 w-full rounded-lg border border-[#262626] bg-[#0A0A0A] px-3 py-2 text-sm text-white placeholder-[#3A3A3A] outline-none focus:border-[#5A4EFF]"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ============================================================ */}
                {/*  NUTRITION TAB                                                */}
                {/* ============================================================ */}
                {activeTab === "nutrition" && (
                    <div className="space-y-6">
                        {/* Calorie arc */}
                        <Card>
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#A1A1AA]">
                                Today&apos;s Targets
                            </h3>
                            <div className="mt-4 flex items-center justify-center">
                                <ArcSVG
                                    value={totalCal}
                                    max={2100}
                                    color="#5A4EFF"
                                />
                            </div>

                            {/* Macro bars */}
                            <div className="mt-6 space-y-3">
                                {[
                                    {
                                        label: "Protein",
                                        value: totalProt,
                                        max: 165,
                                        color: "#5A4EFF",
                                        unit: "g",
                                    },
                                    {
                                        label: "Carbs",
                                        value: totalCarbs,
                                        max: 240,
                                        color: "#E2F4A6",
                                        unit: "g",
                                    },
                                    {
                                        label: "Fat",
                                        value: totalFat,
                                        max: 70,
                                        color: "#EEA0FF",
                                        unit: "g",
                                    },
                                ].map((macro) => (
                                    <div key={macro.label}>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-[#A1A1AA]">
                                                {macro.label}
                                            </span>
                                            <span className="text-[#E4E4E7]">
                                                {macro.value}/{macro.max}
                                                {macro.unit}
                                            </span>
                                        </div>
                                        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[#1A1A1A]">
                                            <div
                                                className="h-full rounded-full transition-all duration-300"
                                                style={{
                                                    width: `${Math.min((macro.value / macro.max) * 100, 100)}%`,
                                                    backgroundColor:
                                                        macro.color,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Meals accordion */}
                        <div className="space-y-3">
                            {meals.map((meal) => {
                                const eaten = eatenMeals.includes(meal.id);
                                const expanded = expandedMeal === meal.id;

                                return (
                                    <Card
                                        key={meal.id}
                                        className={
                                            eaten
                                                ? "border-[#E2F4A6]/10"
                                                : ""
                                        }
                                    >
                                        <button
                                            onClick={() =>
                                                setExpandedMeal(
                                                    expanded
                                                        ? null
                                                        : meal.id,
                                                )
                                            }
                                            className="flex w-full items-center justify-between"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`flex size-8 items-center justify-center rounded-lg ${eaten ? "bg-[#E2F4A6]/10" : "bg-[#262626]"}`}
                                                >
                                                    {eaten ? (
                                                        <CheckCircle className="size-4 text-[#E2F4A6]" />
                                                    ) : (
                                                        <Clock className="size-4 text-[#71717A]" />
                                                    )}
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-sm font-medium text-[#E4E4E7]">
                                                        {meal.name}
                                                    </p>
                                                    <p className="text-xs text-[#71717A]">
                                                        {meal.time} &middot;{" "}
                                                        {meal.calories} kcal
                                                    </p>
                                                </div>
                                            </div>
                                            <ChevronDown
                                                className={`size-4 text-[#71717A] transition duration-100 ease-linear ${expanded ? "rotate-180" : ""}`}
                                            />
                                        </button>

                                        {expanded && (
                                            <div className="mt-4 space-y-3">
                                                <div className="flex gap-4 text-xs text-[#A1A1AA]">
                                                    <span>
                                                        P: {meal.protein}g
                                                    </span>
                                                    <span>
                                                        C: {meal.carbs}g
                                                    </span>
                                                    <span>
                                                        F: {meal.fat}g
                                                    </span>
                                                </div>

                                                <ul className="space-y-1.5">
                                                    {meal.items.map(
                                                        (item, i) => (
                                                            <li
                                                                key={i}
                                                                className="flex items-center gap-2 text-sm text-[#A1A1AA]"
                                                            >
                                                                <span className="size-1 shrink-0 rounded-full bg-[#3A3A3A]" />
                                                                {item}
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>

                                                <button
                                                    onClick={() =>
                                                        toggleMeal(meal.id)
                                                    }
                                                    className={`mt-2 w-full rounded-lg py-2 text-sm font-medium transition duration-100 ease-linear ${
                                                        eaten
                                                            ? "border border-[#262626] bg-transparent text-[#A1A1AA] hover:bg-[#1A1A1A]"
                                                            : "bg-[#E2F4A6] text-[#0A0A0A] hover:bg-[#d5e896]"
                                                    }`}
                                                >
                                                    {eaten
                                                        ? "Mark as not eaten"
                                                        : "Mark as eaten"}
                                                </button>
                                            </div>
                                        )}
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ============================================================ */}
                {/*  RESOURCES TAB                                                */}
                {/* ============================================================ */}
                {activeTab === "resources" && (
                    <div className="space-y-3">
                        {resources.map((res) => (
                            <Card key={res.id}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-10 items-center justify-center rounded-xl bg-[#5A4EFF]/10">
                                            <File06 className="size-5 text-[#5A4EFF]" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium text-[#E4E4E7]">
                                                    {res.name}
                                                </p>
                                                {res.isNew && (
                                                    <span className="rounded-full bg-[#EEA0FF]/10 px-2 py-0.5 text-[10px] font-semibold text-[#EEA0FF]">
                                                        New
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-[#71717A]">
                                                {res.category} &middot; PDF
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() =>
                                            handleDownload(res.name)
                                        }
                                        className="flex size-9 items-center justify-center rounded-lg border border-[#262626] bg-[#111111] transition duration-100 ease-linear hover:bg-[#1A1A1A]"
                                    >
                                        <Download01 className="size-4 text-[#A1A1AA]" />
                                    </button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
