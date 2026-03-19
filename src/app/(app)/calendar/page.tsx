"use client";

import { useState, useMemo, useEffect } from "react";
import { appointments as rawAppointments } from "@/lib/mock-data";
import type { Appointment } from "@/lib/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { InitialsAvatar } from "@/components/ui/initials-avatar";
import { ChevronLeft, ChevronRight, Plus, X, Check, RefreshCw04 } from "@untitledui/icons";

// --- Constants ---

const SERVICE_COLORS: Record<string, string> = {
  "Personal Training": "#5A4EFF",
  "Group HIIT": "#3B82F6",
  "Yoga Flow": "#14B8A6",
  "Boxing Conditioning": "#F97316",
  "Nutrition Consult": "#22C55E",
  "Fitness Assessment": "#EC4899",
  "Trial Session": "#14B8A6",
};

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 06:00 - 21:00

const DAY_NAMES_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Helper to compute mini calendar data for any month
function getMiniCalendarData(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const yearMonth = `${year}-${String(month + 1).padStart(2, "0")}`;
  return { firstDay, daysInMonth, monthLabel, yearMonth, year, month };
}

// IDs of appointments that are recurring
const RECURRING_APPOINTMENT_IDS = new Set(["a1", "a3", "a11", "a14"]);

// Mock client names for the booking form
const MOCK_CLIENTS = [
  "Thando Mbeki",
  "Craig Williams",
  "Zanele Jacobs",
  "Annelize van Wyk",
  "Ayanda Ngcobo",
  "Sihle Ndaba",
  "Ryan Abrahams",
  "Pieter Cloete",
  "Nadine Petersen",
  "Tariq Isaacs",
];

const MOCK_SERVICES = [
  "Personal Training",
  "Group HIIT",
  "Yoga Flow",
  "Boxing Conditioning",
  "Nutrition Consult",
  "Fitness Assessment",
  "Trial Session",
];

const MOCK_LOCATIONS = ["Home Studio", "Client's Home", "Signal Hill Park", "Online (Zoom)"];

const SERVICE_LOCATION_MAP: Record<string, string> = {
  "Personal Training": "Home Studio",
  "Group HIIT": "Signal Hill Park",
  "Yoga Flow": "Client's Home",
  "Boxing Conditioning": "Home Studio",
  "Nutrition Consult": "Online (Zoom)",
  "Fitness Assessment": "Home Studio",
  "Trial Session": "Home Studio",
};

const FREQUENCY_OPTIONS = ["Weekly", "Fortnightly", "Monthly"] as const;
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const ENDS_OPTIONS = ["after", "on-date", "never"] as const;

type RecurringAppointment = Appointment & { recurring?: boolean };

// Augment appointments with recurring flag
const appointments: RecurringAppointment[] = rawAppointments.map((apt) => ({
  ...apt,
  recurring: RECURRING_APPOINTMENT_IDS.has(apt.id),
}));

function formatDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatHour(hour: number): string {
  return `${hour.toString().padStart(2, "0")}:00`;
}

function parseTime(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h + m / 60;
}

function getStatusVariant(status: string): "success" | "warning" | "info" {
  switch (status) {
    case "Confirmed":
      return "success";
    case "Pending":
      return "warning";
    case "Completed":
      return "info";
    default:
      return "info";
  }
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday start
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekDays(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatMobileDateNav(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function formatWeekRange(weekStart: Date): string {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const startMonth = weekStart.toLocaleDateString("en-US", { month: "short" });
  const endMonth = weekEnd.toLocaleDateString("en-US", { month: "short" });
  if (startMonth === endMonth) {
    return `${startMonth} ${weekStart.getDate()}\u2013${weekEnd.getDate()}, ${weekStart.getFullYear()}`;
  }
  return `${startMonth} ${weekStart.getDate()} \u2013 ${endMonth} ${weekEnd.getDate()}, ${weekEnd.getFullYear()}`;
}

function formatDisplayDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDayOfWeekIndex(dateStr: string): number {
  const d = new Date(dateStr + "T00:00:00");
  const day = d.getDay();
  // Convert Sunday=0..Saturday=6 to Monday=0..Sunday=6
  return day === 0 ? 6 : day - 1;
}

function getNextDayOfWeek(dayOfWeek: number, referenceDate: Date): string {
  // dayOfWeek: 0=Sunday, 1=Monday, ..., 6=Saturday
  const d = new Date(referenceDate);
  const currentDay = d.getDay();
  let diff = dayOfWeek - currentDay;
  if (diff <= 0) diff += 7;
  d.setDate(d.getDate() + diff);
  return formatDate(d);
}

// --- Component ---

export default function CalendarPage() {
  const TODAY = new Date(2025, 3, 19); // Saturday Apr 19, 2025

  const [selectedDate, setSelectedDate] = useState<Date>(TODAY);
  const [viewMode, setViewMode] = useState<"Day" | "Week">("Day");
  const [selectedAppointment, setSelectedAppointment] = useState<RecurringAppointment | null>(null);
  const [serviceFilter, setServiceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // New Booking modal state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingClient, setBookingClient] = useState("");
  const [bookingService, setBookingService] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<typeof FREQUENCY_OPTIONS[number]>("Weekly");
  const [repeatDays, setRepeatDays] = useState<boolean[]>([false, false, false, false, false, false, false]);
  const [endsOption, setEndsOption] = useState<typeof ENDS_OPTIONS[number]>("after");
  const [endsAfterSessions, setEndsAfterSessions] = useState(8);
  const [endsOnDate, setEndsOnDate] = useState("");
  const [bookingLocation, setBookingLocation] = useState("");

  // Recurring edit/cancel state for detail panel
  const [recurringEditScope, setRecurringEditScope] = useState<"this" | "future">("this");
  const [recurringCancelScope, setRecurringCancelScope] = useState<"this" | "future">("this");

  // Toast state
  const [showToast, setShowToast] = useState(false);

  // Auto-select the day checkbox when date changes
  useEffect(() => {
    if (bookingDate) {
      const dayIdx = getDayOfWeekIndex(bookingDate);
      setRepeatDays((prev) => {
        const next = [...prev];
        next[dayIdx] = true;
        return next;
      });
    }
  }, [bookingDate]);

  const weekStart = getWeekStart(selectedDate);
  const weekDays = getWeekDays(weekStart);
  const weekDates = weekDays.map(formatDate);
  const selectedDateStr = formatDate(selectedDate);

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      if (serviceFilter !== "all" && apt.service !== serviceFilter) return false;
      if (statusFilter !== "all" && apt.status !== statusFilter) return false;
      return true;
    });
  }, [serviceFilter, statusFilter]);

  // Appointments for the week
  const weekAppointments = useMemo(() => {
    return filteredAppointments.filter((apt) => weekDates.includes(apt.date));
  }, [filteredAppointments, weekDates]);

  // Group by date
  const appointmentsByDate = useMemo(() => {
    const map: Record<string, RecurringAppointment[]> = {};
    for (const apt of weekAppointments) {
      if (!map[apt.date]) map[apt.date] = [];
      map[apt.date].push(apt);
    }
    return map;
  }, [weekAppointments]);

  // Day appointments sorted
  const dayAppointments = useMemo(() => {
    return (filteredAppointments.filter((apt) => apt.date === selectedDateStr))
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [filteredAppointments, selectedDateStr]);

  // Dynamic mini calendar data
  const miniCal = useMemo(() => getMiniCalendarData(selectedDate), [selectedDate]);

  // Days with appointments for mini calendar — checks current visible month
  const daysWithAppointments = useMemo(() => {
    const days = new Set<number>();
    for (const apt of appointments) {
      if (apt.date.startsWith(miniCal.yearMonth + "-")) {
        const day = parseInt(apt.date.split("-")[2], 10);
        days.add(day);
      }
    }
    return days;
  }, [miniCal.yearMonth]);

  const uniqueServices = [...new Set(appointments.map((a) => a.service))];
  const uniqueStatuses = [...new Set(appointments.map((a) => a.status))];

  // Navigation handlers
  function goToToday() {
    setSelectedDate(TODAY);
  }

  function navigatePrev() {
    const d = new Date(selectedDate);
    if (viewMode === "Day") {
      d.setDate(d.getDate() - 1);
    } else {
      d.setDate(d.getDate() - 7);
    }
    setSelectedDate(d);
  }

  function navigateNext() {
    const d = new Date(selectedDate);
    if (viewMode === "Day") {
      d.setDate(d.getDate() + 1);
    } else {
      d.setDate(d.getDate() + 7);
    }
    setSelectedDate(d);
  }

  function openBookingModal() {
    setBookingClient("");
    setBookingService("");
    setBookingDate(selectedDateStr);
    setBookingTime("09:00");
    setIsRecurring(false);
    setFrequency("Weekly");
    setRepeatDays([false, false, false, false, false, false, false]);
    setEndsOption("after");
    setEndsAfterSessions(8);
    setEndsOnDate("");
    setBookingLocation("");
    setIsBookingModalOpen(true);
  }

  function handleSaveBooking() {
    setIsBookingModalOpen(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }

  function toggleRepeatDay(idx: number) {
    setRepeatDays((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  }

  // Compute recurrence preview text
  const recurrencePreview = useMemo(() => {
    if (!isRecurring) return "";
    const selectedDayNames = DAY_LABELS.filter((_, i) => repeatDays[i]);
    if (selectedDayNames.length === 0) return "Select at least one day.";
    const daysStr = selectedDayNames.join(", ");
    const freqStr = frequency.toLowerCase();
    let endStr = "";
    if (endsOption === "after") {
      endStr = `for ${endsAfterSessions} sessions`;
    } else if (endsOption === "on-date" && endsOnDate) {
      endStr = `until ${endsOnDate}`;
    } else if (endsOption === "never") {
      endStr = "indefinitely";
    }
    const totalSessions = endsOption === "after" ? endsAfterSessions : "multiple";
    return `This will create ${totalSessions} sessions ${freqStr} on ${daysStr} ${endStr}.`;
  }, [isRecurring, repeatDays, frequency, endsOption, endsAfterSessions, endsOnDate]);

  // Render the recurring badge
  function RecurringBadge({ apt }: { apt: RecurringAppointment }) {
    if (!apt.recurring) return null;
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#5A4EFF]/10 px-2 py-0.5 text-[10px] font-medium text-[#5A4EFF]">
        <RefreshCw04 className="size-3" />
        Weekly
      </span>
    );
  }

  // Render detail panel content (shared between mobile and desktop)
  function DetailPanel({ appointment, onClose }: { appointment: RecurringAppointment; onClose: () => void }) {
    return (
      <>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#FAFAFA]">Appointment Details</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-[#A1A1AA] transition duration-100 ease-linear hover:bg-[#161616] hover:text-[#FAFAFA]"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mb-4 flex items-center gap-3">
          <InitialsAvatar initials={appointment.clientInitials} src={appointment.clientAvatarUrl} size="lg" />
          <div>
            <p className="text-sm font-semibold text-[#FAFAFA]">
              {appointment.clientName}
            </p>
            <p className="text-xs text-[#A1A1AA]">Client</p>
          </div>
        </div>

        <div className="space-y-3">
          <DetailRow label="Service" value={appointment.service} />
          <DetailRow label="Date" value={formatDisplayDate(appointment.date)} />
          <DetailRow label="Time" value={appointment.time} />
          <DetailRow label="Duration" value={`${appointment.duration} minutes`} />
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#A1A1AA]">Status</span>
            <StatusBadge variant={getStatusVariant(appointment.status)} dot>
              {appointment.status}
            </StatusBadge>
          </div>
          {appointment.recurring && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#A1A1AA]">Recurrence</span>
              <RecurringBadge apt={appointment} />
            </div>
          )}
        </div>

        {/* Recurring edit options */}
        {appointment.recurring && (
          <div className="mt-5 space-y-4">
            {/* Edit scope */}
            <div className="rounded-lg border border-[#262626] bg-[#0D0D0D] p-3">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">Edit Scope</p>
              <label className="flex items-center gap-2 cursor-pointer mb-1.5">
                <input
                  type="radio"
                  name="edit-scope"
                  checked={recurringEditScope === "this"}
                  onChange={() => setRecurringEditScope("this")}
                  className="accent-[#5A4EFF]"
                />
                <span className="text-xs text-[#FAFAFA]">Edit this session only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="edit-scope"
                  checked={recurringEditScope === "future"}
                  onChange={() => setRecurringEditScope("future")}
                  className="accent-[#5A4EFF]"
                />
                <span className="text-xs text-[#FAFAFA]">Edit all future sessions</span>
              </label>
            </div>

            {/* Cancel scope */}
            <div className="rounded-lg border border-[#EF4444]/20 bg-[#0D0D0D] p-3">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">Cancel Scope</p>
              <label className="flex items-center gap-2 cursor-pointer mb-1.5">
                <input
                  type="radio"
                  name="cancel-scope"
                  checked={recurringCancelScope === "this"}
                  onChange={() => setRecurringCancelScope("this")}
                  className="accent-[#EF4444]"
                />
                <span className="text-xs text-[#FAFAFA]">Cancel this session</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="cancel-scope"
                  checked={recurringCancelScope === "future"}
                  onChange={() => setRecurringCancelScope("future")}
                  className="accent-[#EF4444]"
                />
                <span className="text-xs text-[#FAFAFA]">Cancel all future sessions</span>
              </label>
            </div>
          </div>
        )}

        <div className="mt-6 space-y-2">
          <button className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#E2F4A6]/10 px-3 py-2.5 text-xs font-semibold text-[#E2F4A6] transition duration-100 ease-linear hover:bg-[#E2F4A6]/20">
            <Check className="size-3.5" />
            Mark Complete
          </button>
          <button className="w-full rounded-lg border border-[#262626] bg-transparent px-3 py-2.5 text-xs font-semibold text-[#A1A1AA] transition duration-100 ease-linear hover:bg-[#161616] hover:text-[#FAFAFA]">
            Reschedule
          </button>
          <button className="w-full rounded-lg border border-[#EF4444]/30 bg-transparent px-3 py-2.5 text-xs font-semibold text-[#EF4444] transition duration-100 ease-linear hover:bg-[#EF4444]/10">
            {appointment.recurring
              ? recurringCancelScope === "this"
                ? "Cancel This Session"
                : "Cancel All Future Sessions"
              : "Cancel Appointment"}
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="flex h-full min-h-screen flex-col bg-[#0A0A0A]">
      {/* TOP BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#262626] px-4 py-3 lg:px-6 lg:py-4">
        {/* Left: Date nav */}
        <div className="flex items-center gap-2 lg:gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={navigatePrev}
              className="rounded-lg border border-[#262626] bg-[#111111] p-1.5 text-[#A1A1AA] transition duration-100 ease-linear hover:bg-[#161616] hover:text-[#FAFAFA]"
            >
              <ChevronLeft className="size-4" />
            </button>
            {/* Mobile: show day, Desktop: show week range */}
            <span className="min-w-[140px] text-center text-sm font-semibold text-[#FAFAFA] lg:hidden">
              {formatMobileDateNav(selectedDate)}
            </span>
            <span className="hidden min-w-[180px] text-center text-sm font-semibold text-[#FAFAFA] lg:inline">
              {formatWeekRange(weekStart)}
            </span>
            <button
              onClick={navigateNext}
              className="rounded-lg border border-[#262626] bg-[#111111] p-1.5 text-[#A1A1AA] transition duration-100 ease-linear hover:bg-[#161616] hover:text-[#FAFAFA]"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
          <button
            onClick={goToToday}
            className="rounded-lg border border-[#262626] bg-[#111111] px-3 py-1.5 text-xs font-medium text-[#A1A1AA] transition duration-100 ease-linear hover:bg-[#161616] hover:text-[#FAFAFA]"
          >
            Today
          </button>
        </div>

        {/* Center: View toggle (Day / Week only) */}
        <div className="flex items-center rounded-lg border border-[#262626] bg-[#111111]">
          {(["Day", "Week"] as const).map((view) => (
            <button
              key={view}
              onClick={() => setViewMode(view)}
              className={`px-4 py-1.5 text-xs font-medium transition duration-100 ease-linear ${
                viewMode === view
                  ? "bg-[#5A4EFF] text-white"
                  : "text-[#A1A1AA] hover:text-[#FAFAFA]"
              } ${view === "Day" ? "rounded-l-lg" : "rounded-r-lg"}`}
            >
              {view}
            </button>
          ))}
        </div>

        {/* Right: Filters */}
        <div className="flex items-center gap-2">
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="rounded-lg border border-[#262626] bg-[#111111] px-3 py-1.5 text-xs text-[#A1A1AA] outline-none transition duration-100 ease-linear focus:border-[#5A4EFF]"
          >
            <option value="all">All Services</option>
            {uniqueServices.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="hidden rounded-lg border border-[#262626] bg-[#111111] px-3 py-1.5 text-xs text-[#A1A1AA] outline-none transition duration-100 ease-linear focus:border-[#5A4EFF] sm:block"
          >
            <option value="all">All</option>
            {uniqueStatuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {/* Desktop New Booking button */}
          <button
            onClick={openBookingModal}
            className="hidden items-center gap-1.5 rounded-lg bg-[#5A4EFF] px-4 py-1.5 text-xs font-semibold text-white transition duration-100 ease-linear hover:bg-[#4840E8] lg:flex"
          >
            <Plus className="size-3.5" />
            New Booking
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden">
        {/* --- MOBILE DAY VIEW --- */}
        <div
          className={`flex-1 overflow-auto lg:${viewMode === "Week" ? "hidden" : "block"} ${
            viewMode === "Week" ? "hidden" : "block"
          }`}
        >
          {/* Day view: vertical timeline */}
          <div className="relative">
            {HOURS.map((hour) => {
              const hourStr = formatHour(hour);
              const hourAppointments = dayAppointments.filter((apt) => {
                const aptHour = parseInt(apt.time.split(":")[0], 10);
                return aptHour === hour;
              });

              return (
                <div key={hour} className="flex border-b border-[#262626]">
                  {/* Time label */}
                  <div className="flex w-16 shrink-0 items-start justify-end border-r border-[#262626] pr-2 pt-2">
                    <span className="text-[11px] font-medium text-[#A1A1AA]">{hourStr}</span>
                  </div>

                  {/* Slot content */}
                  <div className="min-h-[56px] flex-1 p-1">
                    {hourAppointments.length > 0 ? (
                      hourAppointments.map((apt) => {
                        const color = SERVICE_COLORS[apt.service] || "#5A4EFF";
                        const isSelected = selectedAppointment?.id === apt.id;
                        return (
                          <button
                            key={apt.id}
                            onClick={() => setSelectedAppointment(isSelected ? null : apt)}
                            className={`flex w-full items-center gap-3 rounded-lg border-l-[3px] px-3 py-3 text-left transition duration-100 ease-linear ${
                              isSelected
                                ? "bg-[#5A4EFF]/10 ring-1 ring-[#5A4EFF]/30"
                                : "bg-[#111111] hover:bg-[#1A1A1A]"
                            }`}
                            style={{ borderLeftColor: color }}
                          >
                            {/* Time */}
                            <span className="shrink-0 text-sm font-bold text-[#FAFAFA]">
                              {apt.time}
                            </span>

                            {/* Client + Service */}
                            <div className="flex min-w-0 flex-1 items-center gap-2">
                              <InitialsAvatar initials={apt.clientInitials} src={apt.clientAvatarUrl} size="sm" />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <p className="truncate text-sm font-semibold text-[#FAFAFA]">
                                    {apt.clientName}
                                  </p>
                                  {apt.service === "Trial Session" && (
                                    <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#14B8A6] text-[9px] font-bold text-white">T</span>
                                  )}
                                  {apt.recurring && (
                                    <RefreshCw04 className="size-3 shrink-0 text-[#5A4EFF]" />
                                  )}
                                </div>
                                <span
                                  className="mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium"
                                  style={{
                                    backgroundColor: `${color}15`,
                                    color,
                                  }}
                                >
                                  {apt.service}
                                </span>
                                <span className="mt-0.5 block text-[10px] text-[#71717A]">
                                  {SERVICE_LOCATION_MAP[apt.service] || "Home Studio"}
                                </span>
                              </div>
                            </div>

                            {/* Status dot */}
                            <span
                              className="size-2.5 shrink-0 rounded-full"
                              style={{
                                backgroundColor:
                                  apt.status === "Confirmed"
                                    ? "#22C55E"
                                    : apt.status === "Pending"
                                    ? "#F59E0B"
                                    : "#3B82F6",
                              }}
                            />
                          </button>
                        );
                      })
                    ) : (
                      <div className="flex h-full min-h-[48px] items-center justify-center">
                        <div className="mx-2 h-[1px] w-full border-t border-dashed border-[#262626]" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected appointment detail on mobile (below timeline) */}
          {selectedAppointment && (
            <div className="border-t border-[#262626] bg-[#111111] p-4 lg:hidden">
              <DetailPanel appointment={selectedAppointment} onClose={() => setSelectedAppointment(null)} />
            </div>
          )}
        </div>

        {/* --- DESKTOP WEEK VIEW --- */}
        <div
          className={`flex-1 overflow-auto ${
            viewMode === "Week" ? "hidden lg:block" : "hidden"
          }`}
        >
          {/* Day headers */}
          <div className="sticky top-0 z-10 grid grid-cols-[60px_repeat(7,1fr)] border-b border-[#262626] bg-[#0A0A0A]">
            <div className="border-r border-[#262626]" />
            {weekDays.map((day, i) => {
              const isToday = isSameDay(day, TODAY);
              return (
                <div
                  key={i}
                  className={`flex flex-col items-center border-r border-[#262626] py-3 ${
                    isToday ? "bg-[#5A4EFF]/5" : ""
                  }`}
                >
                  <span
                    className={`text-[10px] font-medium uppercase tracking-wider ${
                      isToday ? "text-[#5A4EFF]" : "text-[#A1A1AA]"
                    }`}
                  >
                    {DAY_NAMES_SHORT[i]}
                  </span>
                  <span
                    className={`mt-0.5 flex size-7 items-center justify-center rounded-full text-sm font-semibold ${
                      isToday ? "bg-[#5A4EFF] text-white" : "text-[#FAFAFA]"
                    }`}
                  >
                    {day.getDate()}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Time grid */}
          <div className="relative grid grid-cols-[60px_repeat(7,1fr)]">
            {HOURS.map((hour) => (
              <div key={hour} className="col-span-full grid grid-cols-[60px_repeat(7,1fr)]">
                <div className="flex h-[60px] items-start justify-end border-r border-[#262626] pr-2 pt-0">
                  <span className="relative -top-2 text-[10px] text-[#A1A1AA]">
                    {formatHour(hour)}
                  </span>
                </div>
                {weekDays.map((day, dayIdx) => {
                  const isToday = isSameDay(day, TODAY);
                  return (
                    <div
                      key={dayIdx}
                      className={`h-[60px] border-b border-r border-[#262626] ${
                        isToday ? "bg-[#5A4EFF]/[0.02]" : ""
                      }`}
                    />
                  );
                })}
              </div>
            ))}

            {/* Appointment blocks overlay */}
            {weekDays.map((day, dayIdx) => {
              const dateStr = formatDate(day);
              const dayApts = appointmentsByDate[dateStr] || [];
              return dayApts.map((apt) => {
                const startTime = parseTime(apt.time);
                const topOffset = (startTime - 6) * 60;
                const height = apt.duration;
                const color = SERVICE_COLORS[apt.service] || "#5A4EFF";

                return (
                  <button
                    key={apt.id}
                    onClick={() => setSelectedAppointment(apt)}
                    className="absolute overflow-hidden rounded-md border-l-[3px] px-1.5 py-1 text-left transition duration-100 ease-linear hover:brightness-110"
                    style={{
                      top: `${topOffset}px`,
                      height: `${height}px`,
                      left: `calc(60px + ${dayIdx} * ((100% - 60px) / 7) + 2px)`,
                      width: `calc((100% - 60px) / 7 - 4px)`,
                      backgroundColor: `${color}15`,
                      borderLeftColor: color,
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <p className="truncate text-[10px] font-semibold leading-tight" style={{ color }}>
                        {apt.clientName}
                      </p>
                      {apt.service === "Trial Session" && (
                        <span className="flex size-3.5 shrink-0 items-center justify-center rounded-full bg-[#14B8A6] text-[8px] font-bold text-white">T</span>
                      )}
                      {apt.recurring && (
                        <RefreshCw04 className="size-2.5 shrink-0" style={{ color }} />
                      )}
                    </div>
                    {height >= 40 && (
                      <p className="mt-0.5 truncate text-[9px] text-[#A1A1AA]">{apt.service}</p>
                    )}
                    {height >= 55 && (
                      <p className="truncate text-[9px] text-[#A1A1AA]">
                        {apt.time} &middot; {apt.duration}min
                      </p>
                    )}
                  </button>
                );
              });
            })}
          </div>
        </div>

        {/* --- RIGHT SIDEBAR (desktop only) --- */}
        <div className="hidden w-[280px] shrink-0 flex-col border-l border-[#262626] bg-[#0A0A0A] lg:flex">
          {/* Mini Calendar */}
          <div className="border-b border-[#262626] p-4">
            <div className="mb-3 flex items-center justify-between">
              <button onClick={() => { const d = new Date(selectedDate); d.setMonth(d.getMonth() - 1); setSelectedDate(d); }} className="rounded p-0.5 text-[#A1A1AA] transition duration-100 ease-linear hover:text-[#FAFAFA]">
                <ChevronLeft className="size-3.5" />
              </button>
              <span className="text-xs font-semibold text-[#FAFAFA]">{miniCal.monthLabel}</span>
              <button onClick={() => { const d = new Date(selectedDate); d.setMonth(d.getMonth() + 1); setSelectedDate(d); }} className="rounded p-0.5 text-[#A1A1AA] transition duration-100 ease-linear hover:text-[#FAFAFA]">
                <ChevronRight className="size-3.5" />
              </button>
            </div>
            <div className="mb-1 grid grid-cols-7 text-center">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <span key={i} className="text-[9px] font-medium text-[#A1A1AA]">
                  {d}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-y-0.5 text-center">
              {Array.from({ length: miniCal.firstDay }, (_, i) => (
                <div key={`empty-${i}`} className="h-7" />
              ))}
              {Array.from({ length: miniCal.daysInMonth }, (_, i) => {
                const day = i + 1;
                const dayDate = new Date(miniCal.year, miniCal.month, day);
                const isToday = isSameDay(dayDate, TODAY);
                const hasAppointment = daysWithAppointments.has(day);
                const isSelected = isSameDay(dayDate, selectedDate);
                const isInWeek = weekDates.includes(formatDate(dayDate));
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(new Date(miniCal.year, miniCal.month, day))}
                    className="flex flex-col items-center"
                  >
                    <span
                      className={`flex size-6 items-center justify-center rounded-full text-[10px] font-medium transition duration-100 ease-linear ${
                        isToday
                          ? "bg-[#5A4EFF] text-white"
                          : isSelected
                          ? "bg-[#5A4EFF]/20 text-[#5A4EFF]"
                          : isInWeek
                          ? "bg-[#5A4EFF]/10 text-[#5A4EFF]"
                          : "text-[#A1A1AA] hover:bg-[#161616]"
                      }`}
                    >
                      {day}
                    </span>
                    {hasAppointment && (
                      <span className="mt-0 h-1 w-1 rounded-full bg-[#5A4EFF]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Appointment Detail or Today's Summary */}
          {selectedAppointment ? (
            <div className="flex-1 overflow-auto p-4">
              <DetailPanel appointment={selectedAppointment} onClose={() => setSelectedAppointment(null)} />
            </div>
          ) : (
            <div className="flex-1 overflow-auto p-4">
              <h3 className="mb-3 text-sm font-semibold text-[#FAFAFA]">
                {isSameDay(selectedDate, TODAY) ? "Today\u2019s Schedule" : selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
              </h3>
              <p className="mb-3 text-xs text-[#A1A1AA]">
                {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} &middot;{" "}
                {dayAppointments.length} session{dayAppointments.length !== 1 ? "s" : ""}
              </p>
              <div className="space-y-2">
                {dayAppointments
                  .map((apt) => {
                    const color = SERVICE_COLORS[apt.service] || "#5A4EFF";
                    return (
                      <button
                        key={apt.id}
                        onClick={() => setSelectedAppointment(apt)}
                        className="flex w-full items-start gap-2.5 rounded-lg border border-[#262626] bg-[#111111] p-2.5 text-left transition duration-100 ease-linear hover:border-[#333333]"
                      >
                        <div
                          className="mt-0.5 h-8 w-1 shrink-0 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <p className="truncate text-xs font-semibold text-[#FAFAFA]">
                                {apt.clientName}
                              </p>
                              {apt.recurring && (
                                <RefreshCw04 className="size-3 shrink-0 text-[#5A4EFF]" />
                              )}
                            </div>
                            <span className="shrink-0 text-[10px] text-[#A1A1AA]">
                              {apt.time}
                            </span>
                          </div>
                          <p className="mt-0.5 text-[10px] text-[#A1A1AA]">{apt.service}</p>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FLOATING ACTION BUTTON (mobile only) */}
      <button
        onClick={openBookingModal}
        className="fixed bottom-[84px] right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#5A4EFF] text-white shadow-xl shadow-[#5A4EFF]/25 lg:hidden"
      >
        <Plus className="size-6" />
      </button>

      {/* NEW BOOKING MODAL */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsBookingModalOpen(false)}
          />

          {/* Modal panel */}
          <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-auto rounded-t-2xl sm:rounded-2xl border border-[#262626] bg-[#0D0D0D] shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#262626] bg-[#0D0D0D] px-5 py-4 rounded-t-2xl">
              <h2 className="text-base font-semibold text-[#FAFAFA]">New Booking</h2>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="rounded-lg p-1.5 text-[#A1A1AA] transition duration-100 ease-linear hover:bg-[#161616] hover:text-[#FAFAFA]"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-5 px-5 py-5">
              {/* Client */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#A1A1AA]">Client</label>
                <select
                  value={bookingClient}
                  onChange={(e) => setBookingClient(e.target.value)}
                  className="w-full rounded-lg border border-[#262626] bg-[#111111] px-3 py-2.5 text-sm text-[#FAFAFA] outline-none transition duration-100 ease-linear focus:border-[#5A4EFF]"
                >
                  <option value="">Select a client</option>
                  {MOCK_CLIENTS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Smart Scheduling Suggestions */}
              {bookingClient && (
                <div className="rounded-lg border border-[#262626] bg-[#111111] px-4 py-3">
                  <p className="mb-2 text-xs text-[#A1A1AA]">
                    Based on <span className="font-medium text-[#FAFAFA]">{bookingClient}</span>&apos;s history:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => { setBookingDate(getNextDayOfWeek(2, TODAY)); setBookingTime("09:00"); }}
                      className="rounded-full border border-[#5A4EFF]/30 bg-[#5A4EFF]/10 px-3 py-1.5 text-[11px] font-medium text-[#5A4EFF] transition duration-100 ease-linear hover:bg-[#5A4EFF]/20"
                    >
                      Tuesdays 9am (80%)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setBookingDate(getNextDayOfWeek(4, TODAY)); setBookingTime("07:00"); }}
                      className="rounded-full border border-[#5A4EFF]/30 bg-[#5A4EFF]/10 px-3 py-1.5 text-[11px] font-medium text-[#5A4EFF] transition duration-100 ease-linear hover:bg-[#5A4EFF]/20"
                    >
                      Thursdays 7am (70%)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setBookingDate(getNextDayOfWeek(1, TODAY)); setBookingTime("10:00"); }}
                      className="rounded-full border border-[#5A4EFF]/30 bg-[#5A4EFF]/10 px-3 py-1.5 text-[11px] font-medium text-[#5A4EFF] transition duration-100 ease-linear hover:bg-[#5A4EFF]/20"
                    >
                      Mondays 10am (60%)
                    </button>
                  </div>
                </div>
              )}

              {/* Service */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#A1A1AA]">Service</label>
                <select
                  value={bookingService}
                  onChange={(e) => setBookingService(e.target.value)}
                  className="w-full rounded-lg border border-[#262626] bg-[#111111] px-3 py-2.5 text-sm text-[#FAFAFA] outline-none transition duration-100 ease-linear focus:border-[#5A4EFF]"
                >
                  <option value="">Select a service</option>
                  {MOCK_SERVICES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#A1A1AA]">Location</label>
                <select
                  value={bookingLocation}
                  onChange={(e) => setBookingLocation(e.target.value)}
                  className="w-full rounded-lg border border-[#262626] bg-[#111111] px-3 py-2.5 text-sm text-[#FAFAFA] outline-none transition duration-100 ease-linear focus:border-[#5A4EFF]"
                >
                  <option value="">Select a location</option>
                  {MOCK_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
                {bookingLocation === "Client's Home" && (
                  <p className="mt-1.5 text-[11px] text-[#F59E0B]">30 min travel buffer will be added</p>
                )}
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#A1A1AA]">Date</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full rounded-lg border border-[#262626] bg-[#111111] px-3 py-2.5 text-sm text-[#FAFAFA] outline-none transition duration-100 ease-linear focus:border-[#5A4EFF] [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#A1A1AA]">Time</label>
                  <input
                    type="time"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full rounded-lg border border-[#262626] bg-[#111111] px-3 py-2.5 text-sm text-[#FAFAFA] outline-none transition duration-100 ease-linear focus:border-[#5A4EFF] [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Recurrence Toggle */}
              <div className="flex items-center justify-between rounded-lg border border-[#262626] bg-[#111111] px-4 py-3">
                <div className="flex items-center gap-2">
                  <RefreshCw04 className="size-4 text-[#A1A1AA]" />
                  <span className="text-sm font-medium text-[#FAFAFA]">Recurring session</span>
                </div>
                <button
                  onClick={() => setIsRecurring(!isRecurring)}
                  className={`relative h-6 w-11 rounded-full transition duration-200 ease-in-out ${
                    isRecurring ? "bg-[#5A4EFF]" : "bg-[#333333]"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-200 ease-in-out ${
                      isRecurring ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Recurrence options */}
              {isRecurring && (
                <div className="space-y-4 rounded-lg border border-[#262626] bg-[#111111] p-4">
                  {/* Frequency */}
                  <div>
                    <label className="mb-2 block text-xs font-medium text-[#A1A1AA]">Frequency</label>
                    <div className="flex rounded-lg border border-[#262626] bg-[#0D0D0D]">
                      {FREQUENCY_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setFrequency(opt)}
                          className={`flex-1 px-3 py-2 text-xs font-medium transition duration-100 ease-linear ${
                            frequency === opt
                              ? "bg-[#5A4EFF] text-white"
                              : "text-[#A1A1AA] hover:text-[#FAFAFA]"
                          } ${opt === "Weekly" ? "rounded-l-lg" : opt === "Monthly" ? "rounded-r-lg" : ""}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Repeat on days */}
                  <div>
                    <label className="mb-2 block text-xs font-medium text-[#A1A1AA]">Repeat on</label>
                    <div className="flex gap-1.5">
                      {DAY_LABELS.map((label, idx) => (
                        <button
                          key={label}
                          onClick={() => toggleRepeatDay(idx)}
                          className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-medium transition duration-100 ease-linear ${
                            repeatDays[idx]
                              ? "bg-[#5A4EFF] text-white"
                              : "border border-[#262626] bg-[#0D0D0D] text-[#A1A1AA] hover:border-[#5A4EFF] hover:text-[#FAFAFA]"
                          }`}
                        >
                          {label.charAt(0)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Ends */}
                  <div>
                    <label className="mb-2 block text-xs font-medium text-[#A1A1AA]">Ends</label>
                    <div className="space-y-2.5">
                      {/* After X sessions */}
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="ends"
                          checked={endsOption === "after"}
                          onChange={() => setEndsOption("after")}
                          className="accent-[#5A4EFF]"
                        />
                        <span className="text-xs text-[#FAFAFA]">After</span>
                        <input
                          type="number"
                          min={1}
                          max={52}
                          value={endsAfterSessions}
                          onChange={(e) => setEndsAfterSessions(Number(e.target.value))}
                          disabled={endsOption !== "after"}
                          className="w-16 rounded-md border border-[#262626] bg-[#0D0D0D] px-2 py-1 text-xs text-[#FAFAFA] outline-none focus:border-[#5A4EFF] disabled:opacity-40 [color-scheme:dark]"
                        />
                        <span className="text-xs text-[#A1A1AA]">sessions</span>
                      </label>

                      {/* On date */}
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="ends"
                          checked={endsOption === "on-date"}
                          onChange={() => setEndsOption("on-date")}
                          className="accent-[#5A4EFF]"
                        />
                        <span className="text-xs text-[#FAFAFA]">On date</span>
                        <input
                          type="date"
                          value={endsOnDate}
                          onChange={(e) => setEndsOnDate(e.target.value)}
                          disabled={endsOption !== "on-date"}
                          className="rounded-md border border-[#262626] bg-[#0D0D0D] px-2 py-1 text-xs text-[#FAFAFA] outline-none focus:border-[#5A4EFF] disabled:opacity-40 [color-scheme:dark]"
                        />
                      </label>

                      {/* Never */}
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="ends"
                          checked={endsOption === "never"}
                          onChange={() => setEndsOption("never")}
                          className="accent-[#5A4EFF]"
                        />
                        <span className="text-xs text-[#FAFAFA]">Never</span>
                      </label>
                    </div>
                  </div>

                  {/* Preview */}
                  {recurrencePreview && (
                    <div className="rounded-lg bg-[#5A4EFF]/5 border border-[#5A4EFF]/20 px-3 py-2.5">
                      <p className="text-xs text-[#5A4EFF]">{recurrencePreview}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 border-t border-[#262626] bg-[#0D0D0D] px-5 py-4 rounded-b-2xl">
              <div className="flex gap-3">
                <button
                  onClick={() => setIsBookingModalOpen(false)}
                  className="flex-1 rounded-lg border border-[#262626] bg-transparent px-4 py-2.5 text-sm font-semibold text-[#A1A1AA] transition duration-100 ease-linear hover:bg-[#161616] hover:text-[#FAFAFA]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveBooking}
                  disabled={!bookingClient || !bookingService || !bookingDate || !bookingTime}
                  className="flex-1 rounded-lg bg-[#5A4EFF] px-4 py-2.5 text-sm font-semibold text-white transition duration-100 ease-linear hover:bg-[#4840E8] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Save Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS TOAST */}
      {showToast && (
        <div className="fixed bottom-24 left-1/2 z-[60] -translate-x-1/2 flex items-center gap-2 rounded-lg bg-[#22C55E] px-4 py-3 shadow-lg lg:bottom-8">
          <Check className="size-4 text-white" />
          <span className="text-sm font-medium text-white">Booking created successfully!</span>
        </div>
      )}
    </div>
  );
}

// --- Helper components ---

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-[#A1A1AA]">{label}</span>
      <span className="text-xs font-medium text-[#FAFAFA]">{value}</span>
    </div>
  );
}
