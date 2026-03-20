"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  User01,
  XClose,
  Check,
  AlertCircle,
  Scissors01,
  Edit05,
} from "@untitledui/icons";

// ─── Types ────────────────────────────────────────────────────────────────────

type ViewMode = "day" | "week";
type AppointmentStatus = "Confirmed" | "Pending" | "In Progress" | "Completed" | "Cancelled";

interface Appointment {
  id: number;
  day: number;
  stylist: string;
  time: string;
  duration: number;
  client: string;
  service: string;
  status: AppointmentStatus;
  note: string;
}

interface NewBookingForm {
  client: string;
  service: string;
  stylist: string;
  day: number;
  time: string;
  duration: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STYLISTS = ["Naledi", "Zinhle", "Buhle"] as const;

const STYLIST_COLORS: Record<string, string> = {
  Naledi: "#D946EF",
  Zinhle: "#3B82F6",
  Buhle: "#F59E0B",
};

const SERVICE_COLORS: Record<string, string> = {
  Braids: "#D946EF",
  "Wash & Blow": "#3B82F6",
  Colour: "#F59E0B",
  Trim: "#14B8A6",
  Relaxer: "#EF4444",
  "Locs Retwist": "#8B5CF6",
  "Silk Press": "#EC4899",
  "Wig Install": "#06B6D4",
  Treatment: "#10B981",
};

const SERVICES = Object.keys(SERVICE_COLORS);

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_LABELS_FULL = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const HOURS = Array.from({ length: 21 }, (_, i) => {
  const hour = 8 + Math.floor(i / 2);
  const min = i % 2 === 0 ? "00" : "30";
  return `${hour.toString().padStart(2, "0")}:${min}`;
});

const HOUR_LABELS = Array.from({ length: 11 }, (_, i) => {
  const hour = 8 + i;
  return `${hour.toString().padStart(2, "0")}:00`;
});

const DURATION_OPTIONS = [30, 60, 90, 120, 150, 180, 210, 240];

const ROW_HEIGHT = 48;

const INITIAL_APPOINTMENTS: Appointment[] = [
  { id: 1, day: 0, stylist: "Naledi", time: "08:00", duration: 180, client: "Thandi M.", service: "Braids", status: "Confirmed", note: "" },
  { id: 2, day: 0, stylist: "Zinhle", time: "08:30", duration: 60, client: "Khanyi L.", service: "Wash & Blow", status: "Confirmed", note: "" },
  { id: 3, day: 0, stylist: "Buhle", time: "09:00", duration: 150, client: "Precious N.", service: "Colour", status: "Pending", note: "" },
  { id: 4, day: 0, stylist: "Naledi", time: "14:00", duration: 90, client: "Ayanda K.", service: "Silk Press", status: "Confirmed", note: "" },
  { id: 5, day: 1, stylist: "Naledi", time: "09:00", duration: 120, client: "Lerato P.", service: "Relaxer", status: "Confirmed", note: "" },
  { id: 6, day: 1, stylist: "Zinhle", time: "10:00", duration: 60, client: "Sibongile D.", service: "Wig Install", status: "In Progress", note: "" },
  { id: 7, day: 1, stylist: "Buhle", time: "09:00", duration: 90, client: "Nompilo S.", service: "Locs Retwist", status: "Confirmed", note: "" },
  { id: 8, day: 2, stylist: "Naledi", time: "08:00", duration: 60, client: "Walk-in", service: "Trim", status: "Pending", note: "" },
  { id: 9, day: 2, stylist: "Zinhle", time: "11:00", duration: 120, client: "Zanele W.", service: "Colour", status: "Confirmed", note: "" },
  { id: 10, day: 3, stylist: "Buhle", time: "08:00", duration: 180, client: "Nomsa T.", service: "Braids", status: "Confirmed", note: "" },
  { id: 11, day: 3, stylist: "Naledi", time: "10:00", duration: 60, client: "Grace M.", service: "Treatment", status: "Pending", note: "" },
  { id: 12, day: 4, stylist: "Zinhle", time: "08:00", duration: 90, client: "Tumi K.", service: "Silk Press", status: "Confirmed", note: "" },
  { id: 13, day: 4, stylist: "Naledi", time: "09:00", duration: 150, client: "Palesa R.", service: "Colour", status: "In Progress", note: "" },
  { id: 14, day: 4, stylist: "Buhle", time: "14:00", duration: 60, client: "Dineo M.", service: "Wash & Blow", status: "Confirmed", note: "" },
  { id: 15, day: 5, stylist: "Naledi", time: "08:00", duration: 180, client: "Mpho S.", service: "Braids", status: "Confirmed", note: "" },
  { id: 16, day: 5, stylist: "Zinhle", time: "08:00", duration: 120, client: "Lindiwe N.", service: "Relaxer", status: "Confirmed", note: "" },
  { id: 17, day: 5, stylist: "Buhle", time: "10:00", duration: 90, client: "Busisiwe J.", service: "Locs Retwist", status: "Pending", note: "" },
];

// ─── Utilities ────────────────────────────────────────────────────────────────

function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
}

function formatDateFull(d: Date): string {
  return d.toLocaleDateString("en-ZA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatWeekRange(monday: Date): string {
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const mMonth = monday.toLocaleDateString("en-ZA", { month: "short" });
  const sMonth = sunday.toLocaleDateString("en-ZA", { month: "short" });
  const year = monday.getFullYear();
  if (mMonth === sMonth) {
    return `${monday.getDate()} - ${sunday.getDate()} ${mMonth} ${year}`;
  }
  return `${monday.getDate()} ${mMonth} - ${sunday.getDate()} ${sMonth} ${year}`;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function timeToGridOffset(time: string): number {
  const mins = timeToMinutes(time);
  const startMins = 8 * 60;
  return ((mins - startMins) / 30) * ROW_HEIGHT;
}

function durationToHeight(duration: number): number {
  return (duration / 30) * ROW_HEIGHT;
}

function getCurrentTimeOffset(): number | null {
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  const startMins = 8 * 60;
  const endMins = 18 * 60;
  if (mins < startMins || mins > endMins) return null;
  return ((mins - startMins) / 30) * ROW_HEIGHT;
}

function getStatusColor(status: AppointmentStatus): string {
  switch (status) {
    case "Confirmed":
      return "#10B981";
    case "Pending":
      return "#F59E0B";
    case "In Progress":
      return "#3B82F6";
    case "Completed":
      return "#6B7280";
    case "Cancelled":
      return "#EF4444";
  }
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function SalonCalendarPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [currentMonday, setCurrentMonday] = useState(() => getMonday(new Date()));
  const [selectedDayIndex, setSelectedDayIndex] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    return day === 0 ? 6 : day - 1;
  });
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showNewBooking, setShowNewBooking] = useState(false);
  const [currentTimeOffset, setCurrentTimeOffset] = useState<number | null>(getCurrentTimeOffset);
  const [newBooking, setNewBooking] = useState<NewBookingForm>({
    client: "",
    service: SERVICES[0],
    stylist: STYLISTS[0],
    day: 0,
    time: "09:00",
    duration: 60,
  });

  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimeOffset(getCurrentTimeOffset());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const weekDates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(currentMonday);
      d.setDate(currentMonday.getDate() + i);
      return d;
    });
  }, [currentMonday]);

  const isCurrentWeek = useMemo(() => {
    const todayMonday = getMonday(new Date());
    return currentMonday.getTime() === todayMonday.getTime();
  }, [currentMonday]);

  const todayIndex = useMemo(() => {
    const today = new Date();
    const day = today.getDay();
    return day === 0 ? 6 : day - 1;
  }, []);

  const navigateWeek = useCallback(
    (direction: -1 | 1) => {
      const next = new Date(currentMonday);
      next.setDate(currentMonday.getDate() + direction * 7);
      setCurrentMonday(next);
    },
    [currentMonday],
  );

  const goToToday = useCallback(() => {
    setCurrentMonday(getMonday(new Date()));
    const today = new Date();
    const day = today.getDay();
    setSelectedDayIndex(day === 0 ? 6 : day - 1);
  }, []);

  const handleStartService = useCallback((id: number) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "In Progress" as AppointmentStatus } : a)),
    );
    setSelectedAppointment((prev) => (prev?.id === id ? { ...prev, status: "In Progress" } : prev));
  }, []);

  const handleCompleteService = useCallback((id: number) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Completed" as AppointmentStatus } : a)),
    );
    setSelectedAppointment((prev) =>
      prev?.id === id ? { ...prev, status: "Completed" } : prev,
    );
  }, []);

  const handleCancelService = useCallback((id: number) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Cancelled" as AppointmentStatus } : a)),
    );
    setSelectedAppointment((prev) =>
      prev?.id === id ? { ...prev, status: "Cancelled" } : prev,
    );
  }, []);

  const handleUpdateNote = useCallback((id: number, note: string) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, note } : a)));
    setSelectedAppointment((prev) => (prev?.id === id ? { ...prev, note } : prev));
  }, []);

  const handleAddBooking = useCallback(() => {
    if (!newBooking.client.trim()) return;
    const id = Math.max(...appointments.map((a) => a.id), 0) + 1;
    const appt: Appointment = {
      id,
      day: newBooking.day,
      stylist: newBooking.stylist,
      time: newBooking.time,
      duration: newBooking.duration,
      client: newBooking.client,
      service: newBooking.service,
      status: "Pending",
      note: "",
    };
    setAppointments((prev) => [...prev, appt]);
    setShowNewBooking(false);
    setNewBooking({
      client: "",
      service: SERVICES[0],
      stylist: STYLISTS[0],
      day: 0,
      time: "09:00",
      duration: 60,
    });
  }, [newBooking, appointments]);

  // ─── Appointment Block ────────────────────────────────────────────────────

  const AppointmentBlock = ({
    appointment,
    compact = false,
  }: {
    appointment: Appointment;
    compact?: boolean;
  }) => {
    const color = SERVICE_COLORS[appointment.service] || "#6B7280";
    const stylistColor = STYLIST_COLORS[appointment.stylist] || "#6B7280";
    const top = timeToGridOffset(appointment.time);
    const height = durationToHeight(appointment.duration);

    if (compact) {
      return (
        <button
          onClick={() => setSelectedAppointment(appointment)}
          className="group mb-1 flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left transition duration-100 ease-linear hover:brightness-110"
          style={{ backgroundColor: `${color}18`, borderLeft: `3px solid ${color}` }}
        >
          <div
            className="flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
            style={{ backgroundColor: color }}
          >
            {getInitials(appointment.client)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-medium text-white/90">
              {appointment.service}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-white/50">
              <span>{appointment.time}</span>
              <span className="inline-block size-1 rounded-full" style={{ backgroundColor: stylistColor }} />
              <span>{appointment.stylist}</span>
            </div>
          </div>
        </button>
      );
    }

    return (
      <button
        onClick={() => setSelectedAppointment(appointment)}
        className="group absolute inset-x-1 overflow-hidden rounded-lg border transition duration-100 ease-linear hover:brightness-110"
        style={{
          top: `${top}px`,
          height: `${Math.max(height - 2, 24)}px`,
          backgroundColor: `${color}20`,
          borderColor: `${color}50`,
        }}
      >
        <div className="absolute inset-y-0 left-0 w-1" style={{ backgroundColor: color }} />
        <div className="flex h-full flex-col justify-center px-3 py-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-xs font-semibold text-white/90">
              {appointment.client}
            </span>
          </div>
          {height >= 48 && (
            <div className="truncate text-[11px] text-white/60">{appointment.service}</div>
          )}
          {height >= 72 && (
            <div className="flex items-center gap-1 text-[10px] text-white/40">
              <Clock className="size-3" />
              <span>
                {appointment.time} - {minutesToTime(timeToMinutes(appointment.time) + appointment.duration)}
              </span>
            </div>
          )}
        </div>
      </button>
    );
  };

  // ─── Time Grid ──────────────────────────────────────────────────────────

  const TimeGrid = ({ children }: { children: React.ReactNode }) => (
    <div className="relative flex flex-1 overflow-auto" ref={gridRef}>
      {/* Time labels */}
      <div className="sticky left-0 z-10 w-16 shrink-0 border-r border-[var(--pa-border-default)] bg-[var(--pa-bg-base)]">
        {HOUR_LABELS.map((hour) => (
          <div
            key={hour}
            className="flex items-start justify-end pr-3 text-[11px] text-white/40"
            style={{ height: `${ROW_HEIGHT * 2}px` }}
          >
            <span className="-translate-y-2">{hour}</span>
          </div>
        ))}
      </div>

      {/* Grid area */}
      <div className="relative flex-1">
        {/* Horizontal grid lines */}
        {HOURS.map((hour, i) => (
          <div
            key={hour}
            className="border-b"
            style={{
              height: `${ROW_HEIGHT}px`,
              borderColor: i % 2 === 0 ? "var(--pa-border-default)" : "var(--pa-border-subtle)",
            }}
          />
        ))}

        {/* Current time indicator */}
        {isCurrentWeek && currentTimeOffset !== null && (
          <div
            className="pointer-events-none absolute right-0 left-0 z-20 flex items-center"
            style={{ top: `${currentTimeOffset}px` }}
          >
            <div className="size-2 rounded-full bg-red-500" />
            <div className="h-px flex-1 bg-red-500" />
          </div>
        )}

        {/* Content columns */}
        <div className="absolute inset-0">{children}</div>
      </div>
    </div>
  );

  // ─── Day View ────────────────────────────────────────────────────────────

  const DayView = () => {
    const dayAppointments = appointments.filter((a) => a.day === selectedDayIndex);

    return (
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Stylist headers */}
        <div className="flex border-b border-[var(--pa-border-default)]">
          <div className="w-16 shrink-0 border-r border-[var(--pa-border-default)]" />
          {STYLISTS.map((stylist) => (
            <div
              key={stylist}
              className="flex flex-1 items-center justify-center gap-2 border-r border-[var(--pa-border-default)] py-3 last:border-r-0"
            >
              <div
                className="flex size-7 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: STYLIST_COLORS[stylist] }}
              >
                {stylist[0]}
              </div>
              <span className="text-sm font-medium text-white/80">{stylist}</span>
            </div>
          ))}
        </div>

        {/* Time grid with columns */}
        <TimeGrid>
          <div className="flex h-full">
            {STYLISTS.map((stylist) => {
              const stylistAppts = dayAppointments.filter((a) => a.stylist === stylist);
              return (
                <div
                  key={stylist}
                  className="relative flex-1 border-r border-[var(--pa-border-default)] last:border-r-0"
                >
                  {stylistAppts.map((appt) => (
                    <AppointmentBlock key={appt.id} appointment={appt} />
                  ))}
                </div>
              );
            })}
          </div>
        </TimeGrid>
      </div>
    );
  };

  // ─── Week View ────────────────────────────────────────────────────────────

  const WeekView = () => (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Day headers */}
      <div className="flex border-b border-[var(--pa-border-default)]">
        <div className="w-16 shrink-0 border-r border-[var(--pa-border-default)]" />
        {weekDates.map((date, i) => {
          const isToday = isCurrentWeek && i === todayIndex;
          return (
            <button
              key={i}
              onClick={() => {
                setSelectedDayIndex(i);
                setViewMode("day");
              }}
              className={`flex flex-1 flex-col items-center border-r border-[var(--pa-border-default)] py-2.5 transition duration-100 ease-linear last:border-r-0 ${
                isToday ? "bg-[#D946EF]/10" : "hover:bg-white/5"
              }`}
            >
              <span className="text-[11px] font-medium uppercase tracking-wider text-white/40">
                {DAY_LABELS[i]}
              </span>
              <span
                className={`mt-0.5 flex size-7 items-center justify-center rounded-full text-sm font-semibold ${
                  isToday ? "bg-[#D946EF] text-white" : "text-white/80"
                }`}
              >
                {date.getDate()}
              </span>
            </button>
          );
        })}
      </div>

      {/* Time grid with day columns */}
      <TimeGrid>
        <div className="flex h-full">
          {weekDates.map((_, dayIdx) => {
            const dayAppts = appointments.filter((a) => a.day === dayIdx);
            return (
              <div
                key={dayIdx}
                className="relative flex-1 border-r border-[var(--pa-border-default)] last:border-r-0"
              >
                {dayAppts.map((appt) => (
                  <AppointmentBlock key={appt.id} appointment={appt} />
                ))}
              </div>
            );
          })}
        </div>
      </TimeGrid>
    </div>
  );

  // ─── Detail Modal ─────────────────────────────────────────────────────────

  const DetailModal = ({ appointment }: { appointment: Appointment }) => {
    const color = SERVICE_COLORS[appointment.service] || "#6B7280";
    const stylistColor = STYLIST_COLORS[appointment.stylist] || "#6B7280";
    const statusColor = getStatusColor(appointment.status);
    const endTime = minutesToTime(
      timeToMinutes(appointment.time) + appointment.duration,
    );
    const dayDate = weekDates[appointment.day];

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        onClick={() => setSelectedAppointment(null)}
      >
        <div
          className="w-full max-w-md overflow-hidden rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative px-6 pt-6 pb-4">
            <div
              className="absolute top-0 right-0 left-0 h-1"
              style={{ backgroundColor: color }}
            />
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">{appointment.client}</h3>
                <p className="mt-0.5 text-sm text-white/50">{appointment.service}</p>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="rounded-lg p-1.5 text-white/40 transition duration-100 ease-linear hover:bg-white/10 hover:text-white"
              >
                <XClose className="size-5" />
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3 border-t border-[var(--pa-border-default)] px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Calendar className="size-4" />
                <span>
                  {dayDate
                    ? `${DAY_LABELS_FULL[appointment.day]}, ${formatDate(dayDate)}`
                    : DAY_LABELS_FULL[appointment.day]}
                </span>
              </div>
              <div
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                style={{
                  backgroundColor: `${statusColor}20`,
                  color: statusColor,
                }}
              >
                <span
                  className="inline-block size-1.5 rounded-full"
                  style={{ backgroundColor: statusColor }}
                />
                {appointment.status}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-white/60">
              <Clock className="size-4" />
              <span>
                {appointment.time} - {endTime} ({appointment.duration} min)
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-white/60">
              <User01 className="size-4" />
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex size-5 items-center justify-center rounded-full text-[9px] font-bold text-white"
                  style={{ backgroundColor: stylistColor }}
                >
                  {appointment.stylist[0]}
                </span>
                <span>{appointment.stylist}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-white/60">
              <Scissors01 className="size-4" />
              <div className="flex items-center gap-2">
                <span
                  className="inline-block size-2.5 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span>{appointment.service}</span>
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="border-t border-[var(--pa-border-default)] px-6 py-4">
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-white/40">
              <Edit05 className="size-3.5" />
              Note
            </label>
            <textarea
              value={appointment.note}
              onChange={(e) => handleUpdateNote(appointment.id, e.target.value)}
              placeholder="Add a note..."
              className="w-full resize-none rounded-lg border border-[var(--pa-border-default)] bg-[var(--pa-bg-elevated)] px-3 py-2 text-sm text-white/80 placeholder:text-white/20 focus:border-[#D946EF]/50 focus:outline-none"
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 border-t border-[var(--pa-border-default)] px-6 py-4">
            {appointment.status === "Confirmed" || appointment.status === "Pending" ? (
              <>
                <button
                  onClick={() => handleStartService(appointment.id)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#D946EF] px-4 py-2.5 text-sm font-medium text-white transition duration-100 ease-linear hover:bg-[#D946EF]/80"
                >
                  <AlertCircle className="size-4" />
                  Start Service
                </button>
                <button
                  onClick={() => handleCancelService(appointment.id)}
                  className="flex items-center justify-center gap-2 rounded-lg border border-red-500/30 px-4 py-2.5 text-sm font-medium text-red-400 transition duration-100 ease-linear hover:bg-red-500/10"
                >
                  Cancel
                </button>
              </>
            ) : appointment.status === "In Progress" ? (
              <>
                <button
                  onClick={() => handleCompleteService(appointment.id)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition duration-100 ease-linear hover:bg-emerald-500"
                >
                  <Check className="size-4" />
                  Complete
                </button>
                <button
                  onClick={() => handleCancelService(appointment.id)}
                  className="flex items-center justify-center gap-2 rounded-lg border border-red-500/30 px-4 py-2.5 text-sm font-medium text-red-400 transition duration-100 ease-linear hover:bg-red-500/10"
                >
                  Cancel
                </button>
              </>
            ) : (
              <div className="flex-1 text-center text-sm text-white/30">
                This appointment is {appointment.status.toLowerCase()}.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ─── New Booking Modal ─────────────────────────────────────────────────────

  const NewBookingModal = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={() => setShowNewBooking(false)}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--pa-border-default)] px-6 py-4">
          <h3 className="text-lg font-semibold text-white">New Booking</h3>
          <button
            onClick={() => setShowNewBooking(false)}
            className="rounded-lg p-1.5 text-white/40 transition duration-100 ease-linear hover:bg-white/10 hover:text-white"
          >
            <XClose className="size-5" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          {/* Client */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/50">Client Name</label>
            <input
              type="text"
              value={newBooking.client}
              onChange={(e) => setNewBooking((b) => ({ ...b, client: e.target.value }))}
              placeholder="e.g. Thandi M."
              className="w-full rounded-lg border border-[var(--pa-border-default)] bg-[var(--pa-bg-elevated)] px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-[#D946EF]/50 focus:outline-none"
            />
          </div>

          {/* Service */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/50">Service</label>
            <div className="flex flex-wrap gap-1.5">
              {SERVICES.map((s) => (
                <button
                  key={s}
                  onClick={() => setNewBooking((b) => ({ ...b, service: s }))}
                  className="rounded-full px-3 py-1.5 text-xs font-medium transition duration-100 ease-linear"
                  style={{
                    backgroundColor:
                      newBooking.service === s
                        ? `${SERVICE_COLORS[s]}30`
                        : "rgba(255,255,255,0.05)",
                    color: newBooking.service === s ? SERVICE_COLORS[s] : "rgba(255,255,255,0.5)",
                    borderWidth: 1,
                    borderColor:
                      newBooking.service === s ? `${SERVICE_COLORS[s]}50` : "transparent",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Stylist */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/50">Stylist</label>
            <div className="flex gap-2">
              {STYLISTS.map((s) => (
                <button
                  key={s}
                  onClick={() => setNewBooking((b) => ({ ...b, stylist: s }))}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition duration-100 ease-linear"
                  style={{
                    borderColor:
                      newBooking.stylist === s ? STYLIST_COLORS[s] : "var(--pa-border-default)",
                    backgroundColor:
                      newBooking.stylist === s ? `${STYLIST_COLORS[s]}15` : "transparent",
                    color: newBooking.stylist === s ? "white" : "rgba(255,255,255,0.5)",
                  }}
                >
                  <span
                    className="inline-flex size-5 items-center justify-center rounded-full text-[9px] font-bold text-white"
                    style={{ backgroundColor: STYLIST_COLORS[s] }}
                  >
                    {s[0]}
                  </span>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Day, Time, Duration row */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/50">Day</label>
              <select
                value={newBooking.day}
                onChange={(e) =>
                  setNewBooking((b) => ({ ...b, day: Number(e.target.value) }))
                }
                className="w-full rounded-lg border border-[var(--pa-border-default)] bg-[var(--pa-bg-elevated)] px-3 py-2.5 text-sm text-white focus:border-[#D946EF]/50 focus:outline-none"
              >
                {DAY_LABELS.map((d, i) => (
                  <option key={i} value={i}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/50">Time</label>
              <select
                value={newBooking.time}
                onChange={(e) => setNewBooking((b) => ({ ...b, time: e.target.value }))}
                className="w-full rounded-lg border border-[var(--pa-border-default)] bg-[var(--pa-bg-elevated)] px-3 py-2.5 text-sm text-white focus:border-[#D946EF]/50 focus:outline-none"
              >
                {HOURS.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/50">Duration</label>
              <select
                value={newBooking.duration}
                onChange={(e) =>
                  setNewBooking((b) => ({ ...b, duration: Number(e.target.value) }))
                }
                className="w-full rounded-lg border border-[var(--pa-border-default)] bg-[var(--pa-bg-elevated)] px-3 py-2.5 text-sm text-white focus:border-[#D946EF]/50 focus:outline-none"
              >
                {DURATION_OPTIONS.map((d) => (
                  <option key={d} value={d}>
                    {d} min
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="border-t border-[var(--pa-border-default)] px-6 py-4">
          <button
            onClick={handleAddBooking}
            disabled={!newBooking.client.trim()}
            className="w-full rounded-lg bg-[#D946EF] px-4 py-2.5 text-sm font-medium text-white transition duration-100 ease-linear hover:bg-[#D946EF]/80 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );

  // ─── Main Render ──────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen flex-col bg-[var(--pa-bg-base)]">
      {/* Top Bar */}
      <header className="flex items-center justify-between border-b border-[var(--pa-border-default)] px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#D946EF]">
              <Scissors01 className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold leading-tight text-white">
                Naledi&apos;s Hair Studio
              </h1>
              <p className="text-[11px] text-white/40">Salon Calendar</p>
            </div>
          </div>
        </div>

        {/* New Booking Button */}
        <button
          onClick={() => setShowNewBooking(true)}
          className="flex items-center gap-2 rounded-lg bg-[#D946EF] px-4 py-2 text-sm font-medium text-white transition duration-100 ease-linear hover:bg-[#D946EF]/80"
        >
          <Plus className="size-4" />
          New Booking
        </button>
      </header>

      {/* Navigation Bar */}
      <div className="flex items-center justify-between border-b border-[var(--pa-border-default)] px-6 py-3">
        <div className="flex items-center gap-3">
          {/* Prev/Next */}
          <div className="flex items-center rounded-lg border border-[var(--pa-border-default)]">
            <button
              onClick={() => navigateWeek(-1)}
              className="px-2.5 py-1.5 text-white/50 transition duration-100 ease-linear hover:bg-white/5 hover:text-white"
            >
              <ChevronLeft className="size-4" />
            </button>
            <div className="h-5 w-px bg-[#262626]" />
            <button
              onClick={() => navigateWeek(1)}
              className="px-2.5 py-1.5 text-white/50 transition duration-100 ease-linear hover:bg-white/5 hover:text-white"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          {/* Today */}
          <button
            onClick={goToToday}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition duration-100 ease-linear ${
              isCurrentWeek
                ? "border-[#D946EF]/30 bg-[#D946EF]/10 text-[#D946EF]"
                : "border-[var(--pa-border-default)] text-white/50 hover:bg-white/5 hover:text-white"
            }`}
          >
            Today
          </button>

          {/* Week label */}
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-white/30" />
            <span className="text-sm font-medium text-white/80">
              {viewMode === "day"
                ? formatDateFull(weekDates[selectedDayIndex])
                : formatWeekRange(currentMonday)}
            </span>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex rounded-lg border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-0.5">
          {(["day", "week"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`rounded-md px-4 py-1.5 text-xs font-medium capitalize transition duration-100 ease-linear ${
                viewMode === mode
                  ? "bg-[#D946EF] text-white"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Service Legend */}
      <div className="flex items-center gap-3 overflow-x-auto border-b border-[var(--pa-border-subtle)] px-6 py-2">
        {Object.entries(SERVICE_COLORS).map(([service, color]) => (
          <div key={service} className="flex shrink-0 items-center gap-1.5">
            <span className="inline-block size-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[11px] text-white/40">{service}</span>
          </div>
        ))}
      </div>

      {/* Calendar Body */}
      {viewMode === "day" ? <DayView /> : <WeekView />}

      {/* Floating Add Button (mobile-friendly) */}
      <button
        onClick={() => setShowNewBooking(true)}
        className="fixed right-6 bottom-6 flex size-14 items-center justify-center rounded-full bg-[#D946EF] shadow-lg shadow-[#D946EF]/25 transition duration-100 ease-linear hover:bg-[#D946EF]/80 lg:hidden"
      >
        <Plus className="size-6 text-white" />
      </button>

      {/* Modals */}
      {selectedAppointment && <DetailModal appointment={selectedAppointment} />}
      {showNewBooking && <NewBookingModal />}
    </div>
  );
}
