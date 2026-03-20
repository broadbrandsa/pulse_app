"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  User01,
  MarkerPin01,
  XClose,
  Check,
  CreditCard01,
} from "@untitledui/icons";

interface YogaClass {
  id: string;
  time: string;
  duration: string;
  name: string;
  style: string;
  instructor: string;
  room: string;
  spotsLeft: number;
  totalSpots: number;
  price: string;
  status: "available" | "waitlist" | "booked" | "full";
}

const weekDays = [
  { label: "Mon", date: "17", full: "Mon 17 Mar" },
  { label: "Tue", date: "18", full: "Tue 18 Mar" },
  { label: "Wed", date: "19", full: "Wed 19 Mar" },
  { label: "Thu", date: "20", full: "Thu 20 Mar" },
  { label: "Fri", date: "21", full: "Fri 21 Mar" },
  { label: "Sat", date: "22", full: "Sat 22 Mar" },
  { label: "Sun", date: "23", full: "Sun 23 Mar" },
];

const classSchedule: Record<string, YogaClass[]> = {
  "20": [
    { id: "b1", time: "06:30", duration: "60 min", name: "Ashtanga Primary", style: "Ashtanga", instructor: "Sipho", room: "Main Studio", spotsLeft: 4, totalSpots: 18, price: "Included", status: "available" },
    { id: "b2", time: "09:00", duration: "60 min", name: "Gentle Hatha", style: "Hatha", instructor: "Lerato", room: "Zen Room", spotsLeft: 6, totalSpots: 15, price: "Included", status: "available" },
    { id: "b3", time: "12:15", duration: "45 min", name: "Lunch Flow", style: "Vinyasa", instructor: "Amahle", room: "Main Studio", spotsLeft: 2, totalSpots: 20, price: "Included", status: "available" },
    { id: "b4", time: "18:00", duration: "60 min", name: "Hot Yoga Flow", style: "Hot", instructor: "Amahle", room: "Flow Room", spotsLeft: 5, totalSpots: 18, price: "Included", status: "booked" },
    { id: "b5", time: "19:30", duration: "75 min", name: "Restorative Bliss", style: "Restorative", instructor: "Lerato", room: "Zen Room", spotsLeft: 9, totalSpots: 12, price: "Included", status: "available" },
  ],
  "21": [
    { id: "b6", time: "07:00", duration: "60 min", name: "Vinyasa Power", style: "Vinyasa", instructor: "Sipho", room: "Main Studio", spotsLeft: 3, totalSpots: 20, price: "Included", status: "booked" },
    { id: "b7", time: "09:00", duration: "60 min", name: "Hot Flow", style: "Hot", instructor: "Amahle", room: "Flow Room", spotsLeft: 7, totalSpots: 18, price: "Included", status: "available" },
    { id: "b8", time: "12:15", duration: "45 min", name: "Lunch Stretch", style: "Hatha", instructor: "Lerato", room: "Zen Room", spotsLeft: 10, totalSpots: 15, price: "Included", status: "available" },
    { id: "b9", time: "17:30", duration: "75 min", name: "Yin Restore", style: "Yin", instructor: "Lerato", room: "Zen Room", spotsLeft: 5, totalSpots: 12, price: "Included", status: "available" },
  ],
  "22": [
    { id: "b10", time: "08:00", duration: "75 min", name: "Weekend Vinyasa", style: "Vinyasa", instructor: "Sipho", room: "Main Studio", spotsLeft: 6, totalSpots: 20, price: "Included", status: "available" },
    { id: "b11", time: "09:30", duration: "60 min", name: "Yin Restore", style: "Yin", instructor: "Lerato", room: "Zen Room", spotsLeft: 4, totalSpots: 12, price: "Included", status: "booked" },
    { id: "b12", time: "11:00", duration: "60 min", name: "Hot Power", style: "Hot", instructor: "Amahle", room: "Flow Room", spotsLeft: 8, totalSpots: 18, price: "Included", status: "available" },
  ],
  "23": [
    { id: "b13", time: "09:00", duration: "90 min", name: "Sunday Slow Flow", style: "Vinyasa", instructor: "Sipho", room: "Main Studio", spotsLeft: 10, totalSpots: 20, price: "Included", status: "available" },
    { id: "b14", time: "11:00", duration: "75 min", name: "Restorative Sunday", style: "Restorative", instructor: "Lerato", room: "Zen Room", spotsLeft: 6, totalSpots: 12, price: "Included", status: "available" },
  ],
  "17": [
    { id: "b15", time: "06:30", duration: "60 min", name: "Sunrise Vinyasa", style: "Vinyasa", instructor: "Sipho", room: "Main Studio", spotsLeft: 0, totalSpots: 20, price: "Included", status: "full" },
    { id: "b16", time: "17:30", duration: "60 min", name: "Hot Power", style: "Hot", instructor: "Amahle", room: "Flow Room", spotsLeft: 0, totalSpots: 18, price: "Included", status: "full" },
  ],
  "18": [
    { id: "b17", time: "06:30", duration: "60 min", name: "Ashtanga Primary", style: "Ashtanga", instructor: "Sipho", room: "Main Studio", spotsLeft: 0, totalSpots: 18, price: "Included", status: "full" },
    { id: "b18", time: "17:30", duration: "60 min", name: "Hot Yoga Flow", style: "Hot", instructor: "Amahle", room: "Flow Room", spotsLeft: 0, totalSpots: 18, price: "Included", status: "full" },
  ],
  "19": [
    { id: "b19", time: "06:30", duration: "60 min", name: "Sunrise Vinyasa", style: "Vinyasa", instructor: "Sipho", room: "Main Studio", spotsLeft: 0, totalSpots: 20, price: "Included", status: "full" },
    { id: "b20", time: "17:30", duration: "60 min", name: "Hot Power", style: "Hot", instructor: "Amahle", room: "Flow Room", spotsLeft: 0, totalSpots: 18, price: "Included", status: "full" },
  ],
};

const styleColors: Record<string, string> = {
  Vinyasa: "bg-[#14B8A6]/15 text-[#14B8A6]",
  Hot: "bg-orange-500/15 text-orange-400",
  Hatha: "bg-blue-500/15 text-blue-400",
  Yin: "bg-purple-500/15 text-purple-400",
  Restorative: "bg-pink-500/15 text-pink-400",
  Ashtanga: "bg-red-500/15 text-red-400",
};

export default function YogaBookPage() {
  const [selectedDay, setSelectedDay] = useState("20");
  const [confirmingClass, setConfirmingClass] = useState<YogaClass | null>(null);
  const [bookedSuccess, setBookedSuccess] = useState(false);

  const classes = classSchedule[selectedDay] || [];

  function handleConfirmBooking() {
    setBookedSuccess(true);
    setTimeout(() => {
      setBookedSuccess(false);
      setConfirmingClass(null);
    }, 2000);
  }

  function getStatusButton(cls: YogaClass) {
    if (cls.status === "booked") {
      return (
        <span className="inline-flex items-center gap-1 rounded-lg bg-[#14B8A6]/15 px-3 py-1.5 text-xs font-semibold text-[#14B8A6]">
          <Check className="size-3" />
          Booked
        </span>
      );
    }
    if (cls.status === "full") {
      return (
        <button
          onClick={() => setConfirmingClass(cls)}
          className="rounded-lg bg-amber-500/15 px-3 py-1.5 text-xs font-semibold text-amber-400 transition hover:bg-amber-500/25"
        >
          Waitlist
        </button>
      );
    }
    return (
      <button
        onClick={() => setConfirmingClass(cls)}
        className="rounded-lg bg-[#14B8A6] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#0D9488]"
      >
        Book
      </button>
    );
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-lg font-bold text-[var(--pa-text-primary)]">Book a Class</h1>
      <p className="mt-1 text-sm text-[var(--pa-text-secondary)]">Browse today&apos;s classes and reserve your spot</p>

      {/* Day Tabs */}
      <div className="mt-4 flex gap-1.5 overflow-x-auto pb-2">
        {weekDays.map((d) => (
          <button
            key={d.date}
            onClick={() => setSelectedDay(d.date)}
            className={`flex min-w-[48px] flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-xs font-medium transition ${
              selectedDay === d.date
                ? "bg-[#14B8A6] text-white"
                : "bg-[var(--pa-bg-surface)] text-[var(--pa-text-secondary)] hover:bg-[var(--pa-bg-elevated)]"
            }`}
          >
            <span className="text-[10px]">{d.label}</span>
            <span className="text-sm font-bold">{d.date}</span>
          </button>
        ))}
      </div>

      {/* Classes */}
      <div className="mt-4 space-y-3">
        {classes.length === 0 && (
          <div className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-6 text-center">
            <p className="text-sm text-[var(--pa-text-muted)]">No classes available for this day</p>
          </div>
        )}
        {classes.map((cls) => (
          <div key={cls.id} className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-[var(--pa-text-primary)]">{cls.name}</p>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${styleColors[cls.style] || ""}`}>
                    {cls.style}
                  </span>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-[var(--pa-text-secondary)]">
                    <Clock className="size-3" />
                    <span>{cls.time} &middot; {cls.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--pa-text-secondary)]">
                    <User01 className="size-3" />
                    <span>{cls.instructor}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--pa-text-secondary)]">
                    <MarkerPin01 className="size-3" />
                    <span>{cls.room}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <span className={`text-[10px] font-medium ${cls.spotsLeft <= 3 && cls.spotsLeft > 0 ? "text-orange-400" : cls.spotsLeft === 0 ? "text-red-400" : "text-[var(--pa-text-muted)]"}`}>
                    {cls.spotsLeft === 0 ? "No spots left" : `${cls.spotsLeft} spots left`}
                  </span>
                </div>
              </div>
              <div className="ml-3">{getStatusButton(cls)}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Confirmation Modal */}
      {confirmingClass && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-6">
            {bookedSuccess ? (
              <div className="py-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#14B8A6]/15">
                  <Check className="size-7 text-[#14B8A6]" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-[var(--pa-text-primary)]">Booking Confirmed!</h3>
                <p className="mt-1 text-sm text-[var(--pa-text-secondary)]">See you on the mat {"\uD83E\uDDD8\u200D\u2640\uFE0F"}</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-[var(--pa-text-primary)]">Confirm Booking</h3>
                  <button onClick={() => setConfirmingClass(null)} className="rounded-lg p-1 text-[var(--pa-text-muted)] hover:bg-[var(--pa-bg-hover)]">
                    <XClose className="size-5" />
                  </button>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="rounded-xl bg-[var(--pa-bg-elevated)] p-3">
                    <p className="text-sm font-semibold text-[var(--pa-text-primary)]">{confirmingClass.name}</p>
                    <p className="mt-1 text-xs text-[var(--pa-text-secondary)]">
                      {weekDays.find((d) => d.date === selectedDay)?.full} &middot; {confirmingClass.time} &middot; {confirmingClass.duration}
                    </p>
                    <p className="mt-0.5 text-xs text-[var(--pa-text-secondary)]">
                      {confirmingClass.instructor} &middot; {confirmingClass.room}
                    </p>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-[var(--pa-bg-elevated)] p-3">
                    <span className="text-xs text-[var(--pa-text-secondary)]">Price</span>
                    <span className="text-sm font-semibold text-[var(--pa-text-primary)]">{confirmingClass.price}</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-[var(--pa-bg-elevated)] p-3">
                    <CreditCard01 className="size-4 text-[var(--pa-text-muted)]" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-[var(--pa-text-primary)]">Monthly Unlimited Membership</p>
                      <p className="text-[10px] text-[var(--pa-text-muted)]">Classes included in your plan</p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => setConfirmingClass(null)}
                    className="flex-1 rounded-lg border border-[var(--pa-border-default)] bg-[var(--pa-bg-elevated)] px-4 py-2.5 text-sm font-medium text-[var(--pa-text-primary)] transition hover:bg-[var(--pa-bg-hover)]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmBooking}
                    className="flex-1 rounded-lg bg-[#14B8A6] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0D9488]"
                  >
                    {confirmingClass.status === "full" ? "Join Waitlist" : "Confirm Booking"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
