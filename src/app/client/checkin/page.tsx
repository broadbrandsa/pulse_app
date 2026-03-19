"use client";

import { useState } from "react";
import { CheckCircle, ArrowLeft } from "@untitledui/icons";
import Link from "next/link";

/* ─── config ─── */
const energyOptions = [
  { emoji: "\u{1F634}", label: "Very Low" },
  { emoji: "\u{1F610}", label: "Low" },
  { emoji: "\u{1F642}", label: "Okay" },
  { emoji: "\u{1F600}", label: "Good" },
  { emoji: "\u26A1", label: "Great" },
];

const stressLevels = ["Very Low", "Low", "Moderate", "High", "Very High"];
const sorenessLevels = ["None", "Low", "Moderate", "High", "Very High"];

export default function CheckinPage() {
  const [energy, setEnergy] = useState<number | null>(null);
  const [sleep, setSleep] = useState(7);
  const [stress, setStress] = useState<string | null>(null);
  const [soreness, setSoreness] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = energy !== null && stress !== null && soreness !== null;

  if (submitted) {
    return (
      <div className="flex min-h-[calc(100vh-7.5rem)] flex-col items-center justify-center px-6 text-center space-y-5">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#E2F4A6]/15">
          <CheckCircle className="size-10 text-[#E2F4A6]" />
        </div>
        <h2 className="text-xl font-bold text-[#FAFAFA]">Check-in logged!</h2>
        <p className="text-sm font-semibold text-[#E2F4A6]">+5 points</p>
        <p className="text-sm text-[#71717A]">Sipho has been notified</p>
        <Link
          href="/client"
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#262626] px-5 py-3 text-sm font-medium text-[#A1A1AA] transition hover:bg-[#1A1A1A]"
        >
          <ArrowLeft className="size-4" /> Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-7">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-[#FAFAFA]">Daily Check-in</h1>
        <span className="flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1.5 text-xs font-semibold text-amber-400">
          <span className="text-sm">{"\u{1F525}"}</span> 12 days
        </span>
      </div>

      {/* Q1: Energy */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-[#FAFAFA]">How&apos;s your energy?</p>
        <div className="flex gap-2">
          {energyOptions.map((opt, i) => (
            <button
              key={opt.label}
              onClick={() => setEnergy(i)}
              className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-3 text-2xl transition ${
                energy === i
                  ? "bg-[#5A4EFF]/15 ring-2 ring-[#5A4EFF]"
                  : "bg-[#141414] hover:bg-[#1A1A1A]"
              }`}
            >
              <span>{opt.emoji}</span>
              <span className="text-[10px] text-[#71717A]">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Q2: Sleep */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[#FAFAFA]">Hours of sleep</p>
          <span className="rounded-lg bg-[#1A1A1A] px-3 py-1 text-sm font-bold tabular-nums text-[#FAFAFA]">{sleep}h</span>
        </div>
        <input
          type="range"
          min={4}
          max={9}
          step={0.5}
          value={sleep}
          onChange={(e) => setSleep(parseFloat(e.target.value))}
          className="w-full accent-[#5A4EFF] [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-[#262626] [&::-webkit-slider-thumb]:mt-[-4px] [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#5A4EFF] [&::-webkit-slider-thumb]:appearance-none"
        />
        <div className="flex justify-between text-[10px] text-[#52525B]">
          <span>4h</span>
          <span>9h</span>
        </div>
      </div>

      {/* Q3: Stress */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-[#FAFAFA]">Stress level</p>
        <div className="flex flex-wrap gap-2">
          {stressLevels.map((level) => (
            <button
              key={level}
              onClick={() => setStress(level)}
              className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                stress === level
                  ? "bg-[#5A4EFF] text-white"
                  : "bg-[#141414] text-[#A1A1AA] hover:bg-[#1A1A1A]"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Q4: Soreness */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-[#FAFAFA]">Muscle soreness</p>
        <div className="flex flex-wrap gap-2">
          {sorenessLevels.map((level) => (
            <button
              key={level}
              onClick={() => setSoreness(level)}
              className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                soreness === level
                  ? "bg-[#EEA0FF] text-[#0A0A0A]"
                  : "bg-[#141414] text-[#A1A1AA] hover:bg-[#1A1A1A]"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Q5: Note */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[#FAFAFA]">Any notes?</p>
          <span className="text-[11px] tabular-nums text-[#52525B]">{note.length}/200</span>
        </div>
        <textarea
          value={note}
          onChange={(e) => e.target.value.length <= 200 && setNote(e.target.value)}
          placeholder="Feeling tight in my lower back..."
          rows={3}
          className="w-full resize-none rounded-xl border border-[#262626] bg-[#141414] px-4 py-3 text-sm text-[#FAFAFA] placeholder-[#52525B] outline-none focus:border-[#5A4EFF]"
        />
      </div>

      {/* Submit */}
      <button
        onClick={() => canSubmit && setSubmitted(true)}
        disabled={!canSubmit}
        className="w-full rounded-xl bg-[#5A4EFF] py-3.5 text-sm font-semibold text-white transition hover:bg-[#4F44E6] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Submit Check-in
      </button>
    </div>
  );
}
