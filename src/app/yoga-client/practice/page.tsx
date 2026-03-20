"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  Award01,
  Star01,
  ChevronLeft,
  ChevronRight,
  Check,
  Target04,
  Trophy01,
  Heart,
} from "@untitledui/icons";

const styleBreakdown = [
  { name: "Vinyasa", pct: 53, color: "#14B8A6" },
  { name: "Hot", pct: 24, color: "#F97316" },
  { name: "Hatha", pct: 12, color: "#3B82F6" },
  { name: "Yin", pct: 9, color: "#A855F7" },
  { name: "Restorative", pct: 3, color: "#EC4899" },
];

const milestones = [
  { id: 1, title: "First Class", subtitle: "Started your journey", date: "Jan 2026", icon: Star01, achieved: true },
  { id: 2, title: "10 Classes", subtitle: "Building a habit", date: "Jan 2026", icon: Award01, achieved: true },
  { id: 3, title: "25 Classes", subtitle: "Dedicated yogi", date: "Feb 2026", icon: Trophy01, achieved: true },
  { id: 4, title: "50 Classes", subtitle: "Half century!", date: "In progress", icon: Heart, achieved: false },
];

const practiceLog = [
  { id: 1, name: "Hot Yoga Flow", date: "Wed 19 Mar", time: "18:00", instructor: "Amahle", style: "Hot", duration: "60 min" },
  { id: 2, name: "Vinyasa Power", date: "Tue 18 Mar", time: "07:00", instructor: "Sipho", style: "Vinyasa", duration: "60 min" },
  { id: 3, name: "Yin Restore", date: "Mon 17 Mar", time: "19:00", instructor: "Lerato", style: "Yin", duration: "75 min" },
  { id: 4, name: "Sunrise Vinyasa", date: "Sun 16 Mar", time: "08:00", instructor: "Sipho", style: "Vinyasa", duration: "60 min" },
  { id: 5, name: "Hot Power", date: "Sat 15 Mar", time: "11:00", instructor: "Amahle", style: "Hot", duration: "60 min" },
  { id: 6, name: "Hatha Foundations", date: "Fri 14 Mar", time: "09:00", instructor: "Lerato", style: "Hatha", duration: "75 min" },
  { id: 7, name: "Vinyasa Flow", date: "Thu 13 Mar", time: "17:30", instructor: "Sipho", style: "Vinyasa", duration: "60 min" },
  { id: 8, name: "Restorative Bliss", date: "Wed 12 Mar", time: "19:00", instructor: "Lerato", style: "Restorative", duration: "75 min" },
];

// Mini calendar for March 2026
const marchDays = Array.from({ length: 31 }, (_, i) => i + 1);
const activeDays = new Set([1, 3, 4, 5, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
const marchStartDay = 6; // March 2026 starts on Sunday (0=Mon in our grid, so Sun=6)

const styleLogColors: Record<string, string> = {
  Vinyasa: "bg-[#14B8A6]/10 text-[#14B8A6]",
  Hot: "bg-orange-500/10 text-orange-400",
  Hatha: "bg-blue-500/10 text-blue-400",
  Yin: "bg-purple-500/10 text-purple-400",
  Restorative: "bg-pink-500/10 text-pink-400",
};

export default function YogaPracticePage() {
  const [celebratedIds, setCelebratedIds] = useState<Set<number>>(new Set());

  return (
    <div className="space-y-6 px-4 py-6">
      {/* Hero Stats */}
      <div className="text-center">
        <div className="text-4xl">{"\uD83D\uDD25"}</div>
        <h1 className="mt-2 text-2xl font-bold text-[var(--pa-text-primary)]">8-day streak</h1>
        <p className="mt-2 text-sm text-[var(--pa-text-secondary)]">
          34 classes &middot; 51 hours &middot; 4 styles
        </p>
      </div>

      {/* Style Breakdown */}
      <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4">
        <h2 className="mb-3 text-sm font-semibold text-[var(--pa-text-primary)]">Style Breakdown</h2>
        {/* Horizontal stacked bar */}
        <div className="mb-3 flex h-6 overflow-hidden rounded-full">
          {styleBreakdown.map((s) => (
            <div
              key={s.name}
              style={{ width: `${s.pct}%`, backgroundColor: s.color }}
              className="flex items-center justify-center transition-all"
            >
              {s.pct >= 10 && <span className="text-[9px] font-bold text-white">{s.pct}%</span>}
            </div>
          ))}
        </div>
        {/* Legend */}
        <div className="flex flex-wrap gap-3">
          {styleBreakdown.map((s) => (
            <div key={s.name} className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-xs text-[var(--pa-text-secondary)]">{s.name} {s.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Attendance Calendar */}
      <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[var(--pa-text-primary)]">March 2026</h2>
          <div className="flex items-center gap-2">
            <button className="rounded-lg p-1 text-[var(--pa-text-muted)] hover:bg-[var(--pa-bg-hover)]">
              <ChevronLeft className="size-4" />
            </button>
            <button className="rounded-lg p-1 text-[var(--pa-text-muted)] hover:bg-[var(--pa-bg-hover)]">
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="py-1 text-[10px] font-medium text-[var(--pa-text-muted)]">{d}</div>
          ))}
          {/* Empty cells for offset */}
          {Array.from({ length: marchStartDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {marchDays.map((day) => {
            const isActive = activeDays.has(day);
            const isToday = day === 20;
            return (
              <div
                key={day}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium mx-auto ${
                  isToday
                    ? "ring-2 ring-[#14B8A6] ring-offset-1 ring-offset-[var(--pa-bg-surface)]"
                    : ""
                } ${
                  isActive
                    ? "bg-[#14B8A6] text-white"
                    : "text-[var(--pa-text-muted)]"
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-[var(--pa-text-muted)]">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#14B8A6]" />
            <span>Class attended</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full ring-2 ring-[#14B8A6]" />
            <span>Today</span>
          </div>
        </div>
      </div>

      {/* Goals */}
      <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4">
        <div className="mb-2 flex items-center gap-2">
          <Target04 className="size-4 text-[#14B8A6]" />
          <h2 className="text-sm font-semibold text-[var(--pa-text-primary)]">Monthly Goal</h2>
        </div>
        <p className="text-sm text-[var(--pa-text-primary)]">16 classes this month</p>
        <div className="mt-2 flex items-center justify-between text-xs text-[var(--pa-text-secondary)]">
          <span>12 / 16 classes</span>
          <span className="text-[#14B8A6]">75%</span>
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--pa-border-default)]">
          <div className="h-full rounded-full bg-[#14B8A6]" style={{ width: "75%" }} />
        </div>
        <p className="mt-2 text-xs text-[var(--pa-text-muted)]">4 more classes to hit your goal!</p>
      </div>

      {/* Milestones */}
      <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4">
        <h2 className="mb-3 text-sm font-semibold text-[var(--pa-text-primary)]">Milestones</h2>
        <div className="space-y-4">
          {milestones.map((m) => {
            const Icon = m.icon;
            const isCelebrated = celebratedIds.has(m.id);
            return (
              <div key={m.id} className="flex items-start gap-3">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${m.achieved ? "bg-[#14B8A6]/15" : "bg-[var(--pa-bg-elevated)]"}`}>
                  <Icon className={`size-4 ${m.achieved ? "text-[#14B8A6]" : "text-[var(--pa-text-muted)]"}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-medium ${m.achieved ? "text-[var(--pa-text-primary)]" : "text-[var(--pa-text-muted)]"}`}>{m.title}</p>
                    {m.achieved && <Check className="size-3.5 text-[#14B8A6]" />}
                  </div>
                  <p className="text-xs text-[var(--pa-text-muted)]">{m.subtitle} &middot; {m.date}</p>
                  {m.achieved && !isCelebrated && (
                    <button
                      onClick={() => setCelebratedIds((prev) => new Set([...prev, m.id]))}
                      className="mt-1 text-xs font-medium text-[#14B8A6] transition hover:text-[#0D9488]"
                    >
                      {"\uD83C\uDF89"} Celebrate!
                    </button>
                  )}
                  {isCelebrated && (
                    <span className="mt-1 inline-block text-xs text-[var(--pa-text-muted)]">{"\uD83C\uDF89"} Celebrated!</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Practice Log */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-[var(--pa-text-primary)]">Practice Log</h2>
        <div className="space-y-2">
          {practiceLog.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-3.5">
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${styleLogColors[entry.style] || "bg-[var(--pa-bg-elevated)]"}`}>
                  <Calendar className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--pa-text-primary)]">{entry.name}</p>
                  <p className="text-xs text-[var(--pa-text-muted)]">
                    {entry.date} &middot; {entry.time} &middot; {entry.instructor}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${styleLogColors[entry.style] || ""}`}>
                  {entry.style}
                </span>
                <p className="mt-0.5 text-[10px] text-[var(--pa-text-muted)]">{entry.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
