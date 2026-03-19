"use client";

import { useState } from "react";
import Link from "next/link";

type Exercise = { name: string; sets: string; reps: string; rest: string; notes: string };
type Day = { name: string; focus: string; exercises: Exercise[] };
type Week = { number: number; theme: string; days: Day[] };

const PROGRAMME = {
  id: "p1", name: "Strength Foundations", description: "12-week progressive overload programme for building baseline strength. Focuses on compound movements with linear progression.",
  difficulty: "Beginner", weeks: 12, category: "Strength",
  clients: [
    { name: "Thando Nkosi", avatar: "TN", progress: 75 },
    { name: "Lerato Mokoena", avatar: "LM", progress: 60 },
    { name: "Ryan Govender", avatar: "RG", progress: 45 },
    { name: "Naledi Phiri", avatar: "NP", progress: 90 },
  ],
};

const WEEKS: Week[] = [
  {
    number: 1, theme: "Foundation & Form",
    days: [
      { name: "Day 1", focus: "Upper Body Push", exercises: [
        { name: "Barbell Bench Press", sets: "4", reps: "8", rest: "90s", notes: "Control the eccentric" },
        { name: "Overhead Press", sets: "3", reps: "10", rest: "60s", notes: "Strict form, no leg drive" },
        { name: "Incline Dumbbell Press", sets: "3", reps: "12", rest: "60s", notes: "30 degree angle" },
        { name: "Tricep Pushdowns", sets: "3", reps: "15", rest: "45s", notes: "Squeeze at bottom" },
        { name: "Lateral Raises", sets: "3", reps: "15", rest: "45s", notes: "Light weight, control" },
      ]},
      { name: "Day 2", focus: "Lower Body", exercises: [
        { name: "Barbell Back Squat", sets: "4", reps: "8", rest: "120s", notes: "Below parallel" },
        { name: "Romanian Deadlift", sets: "3", reps: "10", rest: "90s", notes: "Feel hamstring stretch" },
        { name: "Leg Press", sets: "3", reps: "12", rest: "60s", notes: "Full range of motion" },
        { name: "Walking Lunges", sets: "3", reps: "12 each", rest: "60s", notes: "Bodyweight or light DBs" },
        { name: "Calf Raises", sets: "4", reps: "15", rest: "45s", notes: "Pause at top" },
      ]},
      { name: "Day 3", focus: "Upper Body Pull", exercises: [
        { name: "Barbell Rows", sets: "4", reps: "8", rest: "90s", notes: "Pull to lower chest" },
        { name: "Lat Pulldown", sets: "3", reps: "10", rest: "60s", notes: "Wide grip" },
        { name: "Seated Cable Row", sets: "3", reps: "12", rest: "60s", notes: "Squeeze shoulder blades" },
        { name: "Barbell Curls", sets: "3", reps: "12", rest: "45s", notes: "No swinging" },
        { name: "Face Pulls", sets: "3", reps: "15", rest: "45s", notes: "External rotation at top" },
      ]},
    ],
  },
  {
    number: 2, theme: "Volume Increase",
    days: [
      { name: "Day 1", focus: "Upper Body Push", exercises: [
        { name: "Barbell Bench Press", sets: "4", reps: "10", rest: "90s", notes: "Add 2.5kg from week 1" },
        { name: "Overhead Press", sets: "4", reps: "10", rest: "60s", notes: "Added set" },
        { name: "Dips", sets: "3", reps: "AMRAP", rest: "60s", notes: "Bodyweight" },
        { name: "Cable Flyes", sets: "3", reps: "15", rest: "45s", notes: "Squeeze at peak" },
      ]},
      { name: "Day 2", focus: "Lower Body", exercises: [
        { name: "Barbell Back Squat", sets: "4", reps: "10", rest: "120s", notes: "Add 5kg from week 1" },
        { name: "Deadlift", sets: "4", reps: "6", rest: "150s", notes: "Conventional stance" },
        { name: "Bulgarian Split Squats", sets: "3", reps: "10 each", rest: "60s", notes: "Rear foot elevated" },
        { name: "Leg Curls", sets: "3", reps: "12", rest: "45s", notes: "Slow eccentric" },
      ]},
      { name: "Day 3", focus: "Upper Body Pull", exercises: [
        { name: "Pull-ups", sets: "4", reps: "AMRAP", rest: "90s", notes: "Use band if needed" },
        { name: "Dumbbell Rows", sets: "3", reps: "10 each", rest: "60s", notes: "One arm at a time" },
        { name: "Hammer Curls", sets: "3", reps: "12", rest: "45s", notes: "Neutral grip" },
        { name: "Reverse Flyes", sets: "3", reps: "15", rest: "45s", notes: "Rear delt focus" },
      ]},
    ],
  },
  {
    number: 3, theme: "Intensity Phase",
    days: [
      { name: "Day 1", focus: "Full Body Strength", exercises: [
        { name: "Deadlift", sets: "5", reps: "5", rest: "180s", notes: "Heavy working sets" },
        { name: "Bench Press", sets: "5", reps: "5", rest: "120s", notes: "Progressive overload" },
        { name: "Barbell Row", sets: "4", reps: "8", rest: "90s", notes: "Strict form" },
      ]},
      { name: "Day 2", focus: "Accessory Work", exercises: [
        { name: "Leg Press", sets: "4", reps: "12", rest: "60s", notes: "High volume" },
        { name: "Dumbbell Shoulder Press", sets: "3", reps: "12", rest: "60s", notes: "Seated" },
        { name: "Cable Curls", sets: "3", reps: "15", rest: "45s", notes: "Superset with triceps" },
        { name: "Tricep Dips", sets: "3", reps: "15", rest: "45s", notes: "Superset with curls" },
      ]},
    ],
  },
];

export default function ProgrammeDetailPage() {
  const [openWeeks, setOpenWeeks] = useState<number[]>([1]);
  const [openDays, setOpenDays] = useState<string[]>(["1-Day 1"]);

  const toggleWeek = (num: number) => {
    setOpenWeeks((prev) => prev.includes(num) ? prev.filter((w) => w !== num) : [...prev, num]);
  };

  const toggleDay = (key: string) => {
    setOpenDays((prev) => prev.includes(key) ? prev.filter((d) => d !== key) : [...prev, key]);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA]">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Back */}
        <Link href="/programmes" className="inline-flex items-center gap-1 text-sm text-[#A1A1AA] hover:text-[#FAFAFA] mb-4 transition duration-100 ease-linear">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Programmes
        </Link>

        {/* Header */}
        <div className="bg-[#111111] border border-[#262626] rounded-2xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold">{PROGRAMME.name}</h1>
                <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-[#E2F4A6]/20 text-[#E2F4A6]">{PROGRAMME.difficulty}</span>
              </div>
              <p className="text-sm text-[#A1A1AA]">{PROGRAMME.description}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="text-[#71717A]">{PROGRAMME.weeks} weeks</span>
            <span className="text-[#71717A]">{PROGRAMME.category}</span>
            <span className="text-[#71717A]">{PROGRAMME.clients.length} clients assigned</span>
          </div>
        </div>

        {/* Weeks */}
        <div className="space-y-3 mb-8">
          {WEEKS.map((week) => (
            <div key={week.number} className="bg-[#111111] border border-[#262626] rounded-2xl overflow-hidden">
              <button onClick={() => toggleWeek(week.number)} className="w-full flex items-center justify-between p-4 text-left hover:bg-[#1a1a1a] transition duration-100 ease-linear">
                <div>
                  <span className="font-semibold text-[#FAFAFA]">Week {week.number}</span>
                  <span className="text-sm text-[#71717A] ml-2">{week.theme}</span>
                </div>
                <svg className={`w-5 h-5 text-[#71717A] transition-transform duration-200 ${openWeeks.includes(week.number) ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>

              {openWeeks.includes(week.number) && (
                <div className="border-t border-[#262626]">
                  {week.days.map((day) => {
                    const dayKey = `${week.number}-${day.name}`;
                    const isOpen = openDays.includes(dayKey);
                    return (
                      <div key={dayKey} className="border-b border-[#262626] last:border-b-0">
                        <button onClick={() => toggleDay(dayKey)} className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#0A0A0A]/50 transition duration-100 ease-linear">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-[#FAFAFA]">{day.name}</span>
                            <span className="text-xs text-[#5A4EFF] bg-[#5A4EFF]/10 px-2 py-0.5 rounded">{day.focus}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[#71717A]">{day.exercises.length} exercises</span>
                            <svg className={`w-4 h-4 text-[#71717A] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </div>
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4">
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="text-[#71717A] text-xs">
                                    <th className="text-left pb-2 pr-4 font-medium">Exercise</th>
                                    <th className="text-center pb-2 px-2 font-medium">Sets</th>
                                    <th className="text-center pb-2 px-2 font-medium">Reps</th>
                                    <th className="text-center pb-2 px-2 font-medium">Rest</th>
                                    <th className="text-left pb-2 pl-4 font-medium hidden sm:table-cell">Notes</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {day.exercises.map((ex, i) => (
                                    <tr key={i} className="border-t border-[#262626]/50">
                                      <td className="py-2 pr-4 text-[#FAFAFA]">{ex.name}</td>
                                      <td className="py-2 px-2 text-center text-[#A1A1AA]">{ex.sets}</td>
                                      <td className="py-2 px-2 text-center text-[#A1A1AA]">{ex.reps}</td>
                                      <td className="py-2 px-2 text-center text-[#A1A1AA]">{ex.rest}</td>
                                      <td className="py-2 pl-4 text-[#71717A] hidden sm:table-cell">{ex.notes}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Assigned Clients */}
        <div className="bg-[#111111] border border-[#262626] rounded-2xl p-5">
          <h2 className="font-semibold mb-4">Assigned Clients</h2>
          <div className="space-y-3">
            {PROGRAMME.clients.map((c) => (
              <div key={c.name} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#5A4EFF] to-[#EEA0FF] flex items-center justify-center text-white text-xs font-medium shrink-0">{c.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#FAFAFA]">{c.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-[#262626] rounded-full">
                      <div className="h-full bg-[#5A4EFF] rounded-full" style={{ width: `${c.progress}%` }} />
                    </div>
                    <span className="text-xs text-[#71717A] w-8 text-right">{c.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}