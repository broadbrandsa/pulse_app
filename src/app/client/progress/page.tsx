"use client";

import { useState, useEffect, useRef } from "react";
import {
  Camera01,
  Trophy01,
  TrendUp01,
  TrendDown01,
  CheckCircle,
  Plus,
  ChevronRight,
  Clock,
  Target04,
  Star01,
  Zap,
  Calendar,
  ArrowUp,
} from "@untitledui/icons";

/* ── mock data ─────────────────────────────────────────────── */

const weightData = [
  { date: "Jan 12", value: 78.4 },
  { date: "Jan 26", value: 77.1 },
  { date: "Feb 9", value: 76.2 },
  { date: "Feb 23", value: 75.0 },
  { date: "Mar 9", value: 73.8 },
  { date: "Mar 16", value: 73.2 },
];

const personalBests = [
  { exercise: "Squat", value: "80kg", change: "+20kg" },
  { exercise: "Bench Press", value: "55kg", change: "+15kg" },
  { exercise: "Deadlift", value: "90kg", change: "+25kg" },
  { exercise: "5km Run", value: "28:14", change: "-4:30" },
];

const goals = [
  { label: "Lose 5kg", progress: 64, completed: false },
  { label: "Run 5km under 25 mins", progress: 100, completed: true },
  { label: "Bench press 80kg", progress: 94, completed: false },
  { label: "Complete 12-week programme", progress: 58, completed: false },
];

const milestones = [
  { title: "10 Sessions Completed", date: "Feb 2, 2025", icon: "trophy" },
  { title: "Squat 80kg PB", date: "Feb 18, 2025", icon: "zap" },
  { title: "Lost 3kg", date: "Mar 1, 2025", icon: "trend" },
  { title: "1 Month Anniversary", date: "Feb 12, 2025", icon: "star" },
];

const sessions = [
  { date: "Mar 16", type: "Upper Body Strength", duration: "52 min", completed: true },
  { date: "Mar 14", type: "HIIT Cardio", duration: "35 min", completed: true },
  { date: "Mar 12", type: "Lower Body Power", duration: "48 min", completed: true },
  { date: "Mar 10", type: "Full Body Circuit", duration: "45 min", completed: true },
  { date: "Mar 7", type: "Upper Body Strength", duration: "50 min", completed: true },
  { date: "Mar 5", type: "Core & Flexibility", duration: "30 min", completed: true },
  { date: "Mar 3", type: "Lower Body Power", duration: "47 min", completed: true },
  { date: "Mar 1", type: "HIIT Cardio", duration: "38 min", completed: true },
];

/* ── chart helpers ─────────────────────────────────────────── */

function buildChartPath(data: typeof weightData, width: number, height: number) {
  const minVal = 66;
  const maxVal = 80;
  const padX = 40;
  const padTop = 20;
  const padBottom = 30;
  const chartW = width - padX - 16;
  const chartH = height - padTop - padBottom;

  const points = data.map((d, i) => ({
    x: padX + (i / (data.length - 1)) * chartW,
    y: padTop + chartH - ((d.value - minVal) / (maxVal - minVal)) * chartH,
  }));

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const area = `${line} L ${points[points.length - 1].x} ${padTop + chartH} L ${points[0].x} ${padTop + chartH} Z`;

  const goalY = padTop + chartH - ((68 - minVal) / (maxVal - minVal)) * chartH;

  const gridLines = [68, 72, 76, 80].map((v) => ({
    y: padTop + chartH - ((v - minVal) / (maxVal - minVal)) * chartH,
    label: `${v}`,
  }));

  return { points, line, area, goalY, gridLines, padX, chartW, padTop, chartH };
}

/* ── component ─────────────────────────────────────────────── */

export default function ProgressPage() {
  const [sliderValue, setSliderValue] = useState(50);
  const [celebrating, setCelebrating] = useState<number | null>(null);
  const [animatedProgress, setAnimatedProgress] = useState<number[]>(goals.map(() => 0));

  // Animate progress bars on mount
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedProgress(goals.map((g) => g.progress));
    }, 300);
    return () => clearTimeout(timeout);
  }, []);

  const handleCelebrate = (index: number) => {
    setCelebrating(index);
    setTimeout(() => setCelebrating(null), 3000);
  };

  const chartWidth = 600;
  const chartHeight = 200;
  const chart = buildChartPath(weightData, chartWidth, chartHeight);

  return (
    <div className="space-y-6 px-4 pt-6 pb-8">
      {/* ── 1. Header ──────────────────────────────────── */}
      <section>
        <h1 className="text-2xl font-bold text-[#FAFAFA]">Your Progress</h1>
        <p className="mt-1 text-sm text-[#A1A1AA]">
          Member since Jan 12, 2025 &middot; 66 days
        </p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#5A4EFF]/15 px-4 py-2 text-sm font-medium text-[#A78BFA]">
          <TrendDown01 className="size-4 text-[#E2F4A6]" />
          <span className="text-[#E2F4A6]">Down 5.2kg</span>
          <span className="text-[#A1A1AA]">&middot;</span>
          <span>28 sessions</span>
          <span className="text-[#A1A1AA]">&middot;</span>
          <span>12-day streak</span>
        </div>
      </section>

      {/* ── 2. Before / After ──────────────────────────── */}
      <section className="rounded-2xl bg-[#111111] p-6">
        <h2 className="mb-4 text-lg font-semibold text-[#FAFAFA]">Before &amp; After</h2>
        <div className="relative overflow-hidden rounded-xl">
          {/* Before box */}
          <div className="flex aspect-[3/4] w-full items-center justify-center bg-[#1A1A1A]">
            <div className="flex flex-col items-center gap-2 text-[#52525B]">
              <Camera01 className="size-8" />
              <span className="text-xs font-medium">Before &middot; Jan 12</span>
            </div>
          </div>
          {/* After box overlaying with clip-path */}
          <div
            className="absolute inset-0 flex aspect-[3/4] w-full items-center justify-center bg-[#222222]"
            style={{ clipPath: `inset(0 0 0 ${sliderValue}%)` }}
          >
            <div className="flex flex-col items-center gap-2 text-[#52525B]">
              <Camera01 className="size-8" />
              <span className="text-xs font-medium">Latest &middot; Mar 10</span>
            </div>
          </div>
          {/* Slider line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white/80"
            style={{ left: `${sliderValue}%` }}
          />
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={sliderValue}
          onChange={(e) => setSliderValue(Number(e.target.value))}
          className="mt-3 w-full accent-[#5A4EFF]"
        />
        <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#5A4EFF] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#4F43E6]">
          <Camera01 className="size-4" />
          Add today&apos;s photo
        </button>
        <p className="mt-2 text-center text-[10px] text-[#52525B]">
          Photos stored securely per POPIA. Only you and your trainer can view them.
        </p>
      </section>

      {/* ── 3. Key Metrics ─────────────────────────────── */}
      <section className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
        {[
          { label: "Weight", value: "73.2kg", change: "5.2kg", down: true },
          { label: "Body Fat", value: "26.1%", change: "2.3%", down: true },
          { label: "Sessions", value: "28", change: null, down: false },
          { label: "Streak", value: "12 days", change: null, down: false, fire: true },
        ].map((m) => (
          <div
            key={m.label}
            className="flex min-w-[140px] shrink-0 flex-col gap-1 rounded-2xl bg-[#111111] p-4"
          >
            <span className="text-xs text-[#71717A]">{m.label}</span>
            <span className="text-xl font-bold text-[#FAFAFA]">
              {m.fire && <span className="mr-1">&#x1F525;</span>}
              {m.value}
            </span>
            {m.change && (
              <span className="flex items-center gap-1 text-xs font-medium text-[#E2F4A6]">
                <TrendDown01 className="size-3" />
                &darr;{m.change}
              </span>
            )}
          </div>
        ))}
      </section>

      {/* ── 4. Weight Chart ────────────────────────────── */}
      <section className="rounded-2xl bg-[#111111] p-6">
        <h2 className="mb-4 text-lg font-semibold text-[#FAFAFA]">Weight Trend</h2>
        <div className="w-full overflow-x-auto">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E2F4A6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#E2F4A6" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {chart.gridLines.map((gl) => (
              <g key={gl.label}>
                <line
                  x1={chart.padX}
                  y1={gl.y}
                  x2={chart.padX + chart.chartW}
                  y2={gl.y}
                  stroke="#262626"
                  strokeWidth={1}
                />
                <text x={4} y={gl.y + 4} fill="#52525B" fontSize={11}>
                  {gl.label}
                </text>
              </g>
            ))}

            {/* Goal dashed line */}
            <line
              x1={chart.padX}
              y1={chart.goalY}
              x2={chart.padX + chart.chartW}
              y2={chart.goalY}
              stroke="#5A4EFF"
              strokeWidth={1}
              strokeDasharray="6 4"
            />
            <text x={chart.padX + chart.chartW - 60} y={chart.goalY - 6} fill="#5A4EFF" fontSize={11} fontWeight={600}>
              Goal: 68kg
            </text>

            {/* Area */}
            <path d={chart.area} fill="url(#areaGrad)" />

            {/* Line */}
            <path d={chart.line} fill="none" stroke="#E2F4A6" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

            {/* Dots */}
            {chart.points.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={4} fill="#E2F4A6" stroke="#111111" strokeWidth={2} />
            ))}

            {/* X-axis labels */}
            {weightData.map((d, i) => (
              <text
                key={d.date}
                x={chart.points[i].x}
                y={chart.padTop + chart.chartH + 18}
                fill="#52525B"
                fontSize={10}
                textAnchor="middle"
              >
                {d.date}
              </text>
            ))}
          </svg>
        </div>
      </section>

      {/* ── 5. Personal Bests ──────────────────────────── */}
      <section className="rounded-2xl bg-[#111111] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#FAFAFA]">Personal Bests</h2>
          <Trophy01 className="size-5 text-[#E2F4A6]" />
        </div>
        <div className="space-y-3">
          {personalBests.map((pb) => (
            <div key={pb.exercise} className="flex items-center justify-between rounded-xl bg-[#1A1A1A] px-4 py-3">
              <div>
                <p className="text-sm font-medium text-[#FAFAFA]">{pb.exercise}</p>
                <p className="text-xs text-[#71717A]">Personal best</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-[#FAFAFA]">{pb.value}</p>
                <p className="text-xs font-medium text-[#E2F4A6]">{pb.change}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#262626] px-4 py-3 text-sm font-semibold text-[#FAFAFA] transition hover:bg-[#1A1A1A]">
          <Plus className="size-4" />
          Log new PB
        </button>
      </section>

      {/* ── 6. Goals Progress ──────────────────────────── */}
      <section className="rounded-2xl bg-[#111111] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#FAFAFA]">Goals</h2>
          <Target04 className="size-5 text-[#5A4EFF]" />
        </div>
        <div className="space-y-4">
          {goals.map((g, i) => (
            <div key={g.label}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm text-[#FAFAFA]">{g.label}</span>
                {g.completed ? (
                  <span className="flex items-center gap-1 text-xs font-medium text-[#E2F4A6]">
                    <CheckCircle className="size-3.5" />
                    Complete
                  </span>
                ) : (
                  <span className="text-xs font-medium text-[#A1A1AA]">{g.progress}%</span>
                )}
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#1A1A1A]">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${animatedProgress[i]}%`,
                    backgroundColor: g.completed ? "#E2F4A6" : "#5A4EFF",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. Milestones Timeline ─────────────────────── */}
      <section className="rounded-2xl bg-[#111111] p-6">
        <h2 className="mb-4 text-lg font-semibold text-[#FAFAFA]">Milestones</h2>

        {/* Celebration banner */}
        {celebrating !== null && (
          <div className="mb-4 flex items-center justify-center gap-2 rounded-xl bg-[#E2F4A6] px-4 py-3 text-sm font-bold text-[#0A0A0A]">
            &#x1F389;&#x1F38A; Way to go! {milestones[celebrating].title}! &#x1F38A;&#x1F389;
          </div>
        )}

        <div className="relative ml-3 border-l-2 border-[#262626] pl-6">
          {milestones.map((m, i) => (
            <div key={m.title} className="relative mb-6 last:mb-0">
              {/* Dot */}
              <div className="absolute -left-[31px] flex h-4 w-4 items-center justify-center rounded-full bg-[#5A4EFF]">
                <div className="h-2 w-2 rounded-full bg-[#E2F4A6]" />
              </div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-[#FAFAFA]">{m.title}</p>
                  <p className="text-xs text-[#71717A]">{m.date}</p>
                </div>
                <button
                  onClick={() => handleCelebrate(i)}
                  className="shrink-0 rounded-lg bg-[#1A1A1A] px-3 py-1.5 text-xs font-medium text-[#E2F4A6] transition hover:bg-[#262626]"
                >
                  Celebrate
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 8. Session History ──────────────────────────── */}
      <section className="rounded-2xl bg-[#111111] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#FAFAFA]">Session History</h2>
          <Calendar className="size-5 text-[#71717A]" />
        </div>
        <div className="space-y-2">
          {sessions.map((s, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl bg-[#1A1A1A] px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="size-4 text-[#E2F4A6]" />
                <div>
                  <p className="text-sm font-medium text-[#FAFAFA]">{s.type}</p>
                  <p className="text-xs text-[#71717A]">{s.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#A1A1AA]">
                <Clock className="size-3" />
                {s.duration}
              </div>
            </div>
          ))}
        </div>
        <button className="mt-4 flex w-full items-center justify-center gap-1 text-sm font-medium text-[#5A4EFF] transition hover:text-[#7A72FF]">
          View all
          <ChevronRight className="size-4" />
        </button>
      </section>
    </div>
  );
}
