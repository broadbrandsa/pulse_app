"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  User01,
  Users01,
  XClose,
  FilterLines,
  LayoutGrid01,
  List,
  MarkerPin01,
} from "@untitledui/icons";

// ─── Types ────────────────────────────────────────────────────────────────────

type ViewMode = "week" | "list";
type YogaStyle = "Vinyasa" | "Hatha" | "Yin" | "Hot" | "Restorative" | "Power" | "Slow Flow" | "Meditation" | "Community Vinyasa";
type RoomType = "Flow" | "Yin";

interface YogaClass {
  id: number;
  day: number; // 0=Mon ... 6=Sun
  time: string; // "HH:MM"
  duration: number; // minutes
  name: string;
  style: YogaStyle;
  instructor: string;
  initials: string;
  room: RoomType;
  capacity: number;
  enrolled: number;
  isFree?: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STYLE_COLORS: Record<string, string> = {
  Vinyasa: "#5A4EFF",
  "Community Vinyasa": "#5A4EFF",
  Hatha: "#EEA0FF",
  Yin: "#0D9488",
  Restorative: "#0D9488",
  Hot: "#EF4444",
  "Hot Yoga": "#EF4444",
  Power: "#F59E0B",
  "Slow Flow": "#5A4EFF",
  Meditation: "#0D9488",
};

const ROOM_CAPACITY: Record<RoomType, number> = {
  Flow: 20,
  Yin: 12,
};

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_LABELS_FULL = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const INSTRUCTORS = ["Amahle", "Candice", "Ravi", "Sipho"];
const STYLES_FILTER = ["All", "Vinyasa", "Hatha", "Yin", "Hot", "Restorative", "Power"];
const ROOMS: RoomType[] = ["Flow", "Yin"];

const GRID_START_HOUR = 6;
const GRID_END_HOUR = 21;
const SLOT_COUNT = (GRID_END_HOUR - GRID_START_HOUR) * 2; // 30-min slots
const ROW_HEIGHT = 48;

const HOUR_LABELS = Array.from({ length: GRID_END_HOUR - GRID_START_HOUR }, (_, i) => {
  const hour = GRID_START_HOUR + i;
  return `${hour.toString().padStart(2, "0")}:00`;
});

const HALF_HOUR_SLOTS = Array.from({ length: SLOT_COUNT }, (_, i) => {
  const hour = GRID_START_HOUR + Math.floor(i / 2);
  const min = i % 2 === 0 ? "00" : "30";
  return `${hour.toString().padStart(2, "0")}:${min}`;
});

// ─── Seed helper ──────────────────────────────────────────────────────────────

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function randomEnrollment(capacity: number, seed: number): number {
  const pct = 0.6 + seededRandom(seed) * 0.4; // 60-100%
  return Math.min(capacity, Math.round(capacity * pct));
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

function buildSchedule(): YogaClass[] {
  let id = 0;
  const classes: YogaClass[] = [];

  const add = (day: number, time: string, name: string, style: YogaStyle, instructor: string, initials: string, room: RoomType, isFree?: boolean) => {
    id++;
    const capacity = ROOM_CAPACITY[room];
    classes.push({
      id,
      day,
      time,
      duration: style === "Power" ? 60 : style === "Hot" || name === "Hot Yoga" ? 75 : style === "Yin" || style === "Restorative" || style === "Meditation" ? 60 : 60,
      name,
      style,
      instructor,
      initials,
      room,
      capacity,
      enrolled: randomEnrollment(capacity, id * 7 + day * 31),
      isFree,
    });
  };

  // Mon
  add(0, "06:30", "Hot Yoga", "Hot", "Amahle", "AD", "Flow");
  add(0, "09:00", "Hatha Flow", "Hatha", "Candice", "CM", "Yin");
  add(0, "18:00", "Vinyasa", "Vinyasa", "Ravi", "RK", "Flow");
  add(0, "19:30", "Yin Yoga", "Yin", "Sipho", "SN", "Yin");

  // Tue
  add(1, "07:00", "Vinyasa", "Vinyasa", "Ravi", "RK", "Flow");
  add(1, "08:30", "Restorative", "Restorative", "Candice", "CM", "Yin");
  add(1, "12:00", "Power Yoga", "Power", "Ravi", "RK", "Flow");
  add(1, "18:30", "Hot Yoga", "Hot", "Amahle", "AD", "Flow");

  // Wed
  add(2, "06:30", "Hot Yoga", "Hot", "Amahle", "AD", "Flow");
  add(2, "09:30", "Vinyasa", "Vinyasa", "Ravi", "RK", "Flow");
  add(2, "10:30", "Restorative", "Restorative", "Candice", "CM", "Yin");
  add(2, "12:00", "Power Yoga", "Power", "Ravi", "RK", "Flow");
  add(2, "18:00", "Yin Yoga", "Yin", "Sipho", "SN", "Yin");

  // Thu
  add(3, "07:00", "Vinyasa", "Vinyasa", "Ravi", "RK", "Flow");
  add(3, "09:00", "Hatha Flow", "Hatha", "Candice", "CM", "Yin");
  add(3, "18:00", "Hot Yoga", "Hot", "Amahle", "AD", "Flow");
  add(3, "19:30", "Meditation", "Meditation", "Sipho", "SN", "Yin");

  // Fri
  add(4, "06:30", "Hot Yoga", "Hot", "Amahle", "AD", "Flow");
  add(4, "09:30", "Vinyasa", "Vinyasa", "Ravi", "RK", "Flow");
  add(4, "12:00", "Power Yoga", "Power", "Ravi", "RK", "Flow");
  add(4, "18:30", "Yin Yoga", "Yin", "Sipho", "SN", "Yin");

  // Sat
  add(5, "08:00", "Community Vinyasa", "Community Vinyasa", "Amahle", "AD", "Flow", true);
  add(5, "09:30", "Hatha Flow", "Hatha", "Candice", "CM", "Yin");
  add(5, "11:00", "Hot Yoga", "Hot", "Amahle", "AD", "Flow");

  // Sun
  add(6, "09:00", "Slow Flow", "Slow Flow", "Candice", "CM", "Flow");
  add(6, "10:30", "Yin Yoga", "Yin", "Sipho", "SN", "Yin");

  return classes;
}

const ALL_CLASSES = buildSchedule();

// ─── Utilities ────────────────────────────────────────────────────────────────

function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatWeekRange(monday: Date): string {
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const mMonth = monday.toLocaleDateString("en-ZA", { month: "short" });
  const sMonth = sunday.toLocaleDateString("en-ZA", { month: "short" });
  const year = monday.getFullYear();
  if (mMonth === sMonth) {
    return `${monday.getDate()} – ${sunday.getDate()} ${mMonth} ${year}`;
  }
  return `${monday.getDate()} ${mMonth} – ${sunday.getDate()} ${sMonth} ${year}`;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
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

function timeToGridOffset(time: string): number {
  const mins = timeToMinutes(time);
  const startMins = GRID_START_HOUR * 60;
  return ((mins - startMins) / 30) * ROW_HEIGHT;
}

function durationToHeight(duration: number): number {
  return (duration / 30) * ROW_HEIGHT;
}

function getStyleColor(style: string): string {
  return STYLE_COLORS[style] || "#6B7280";
}

function matchesStyleFilter(cls: YogaClass, filter: string): boolean {
  if (filter === "All") return true;
  if (filter === "Vinyasa") return cls.style === "Vinyasa" || cls.style === "Community Vinyasa" || cls.style === "Slow Flow";
  if (filter === "Yin") return cls.style === "Yin" || cls.style === "Restorative" || cls.style === "Meditation";
  if (filter === "Hot") return cls.style === "Hot";
  if (filter === "Hatha") return cls.style === "Hatha";
  if (filter === "Restorative") return cls.style === "Restorative";
  if (filter === "Power") return cls.style === "Power";
  return true;
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function YogaSchedulePage() {
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [currentMonday, setCurrentMonday] = useState(() => getMonday(new Date()));
  const [selectedClass, setSelectedClass] = useState<YogaClass | null>(null);
  const [styleFilter, setStyleFilter] = useState("All");
  const [instructorFilter, setInstructorFilter] = useState("All Instructors");
  const [roomFilter, setRoomFilter] = useState("All Rooms");

  const gridRef = useRef<HTMLDivElement>(null);

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

  const filteredClasses = useMemo(() => {
    return ALL_CLASSES.filter((cls) => {
      if (!matchesStyleFilter(cls, styleFilter)) return false;
      if (instructorFilter !== "All Instructors" && cls.instructor !== instructorFilter) return false;
      if (roomFilter !== "All Rooms" && cls.room !== roomFilter) return false;
      return true;
    });
  }, [styleFilter, instructorFilter, roomFilter]);

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
  }, []);

  // ─── Current time indicator ─────────────────────────────────────────────
  const [currentTimeOffset, setCurrentTimeOffset] = useState<number | null>(null);

  useEffect(() => {
    function calc() {
      const now = new Date();
      const mins = now.getHours() * 60 + now.getMinutes();
      const startMins = GRID_START_HOUR * 60;
      const endMins = GRID_END_HOUR * 60;
      if (mins < startMins || mins > endMins) return null;
      return ((mins - startMins) / 30) * ROW_HEIGHT;
    }
    setCurrentTimeOffset(calc());
    const interval = setInterval(() => setCurrentTimeOffset(calc()), 60000);
    return () => clearInterval(interval);
  }, []);

  // ─── Class Block (week grid) ────────────────────────────────────────────

  const ClassBlock = ({ cls }: { cls: YogaClass }) => {
    const color = getStyleColor(cls.style);
    const top = timeToGridOffset(cls.time);
    const height = durationToHeight(cls.duration);
    const isFull = cls.enrolled >= cls.capacity;

    return (
      <button
        onClick={() => setSelectedClass(cls)}
        className="group absolute inset-x-1 overflow-hidden rounded-lg border transition duration-100 ease-linear hover:brightness-110"
        style={{
          top: `${top}px`,
          height: `${Math.max(height - 2, 24)}px`,
          backgroundColor: `${color}20`,
          borderColor: `${color}50`,
        }}
      >
        <div className="absolute inset-y-0 left-0 w-1" style={{ backgroundColor: color }} />
        <div className="flex h-full flex-col justify-center gap-0.5 px-2.5 py-1">
          <div className="flex items-center gap-1">
            <span className="truncate text-xs font-semibold" style={{ color: `${color}` }}>
              {cls.name}
            </span>
            {cls.isFree && (
              <span
                className="shrink-0 rounded px-1 py-px text-[9px] font-bold leading-tight text-white"
                style={{ backgroundColor: color }}
              >
                FREE
              </span>
            )}
          </div>
          {height >= 48 && (
            <div className="flex items-center gap-1.5 text-[11px]" style={{ color: `${color}CC` }}>
              <span
                className="flex size-4 shrink-0 items-center justify-center rounded-full text-[8px] font-bold text-white"
                style={{ backgroundColor: color }}
              >
                {cls.initials[0]}
              </span>
              <span className="truncate">{cls.instructor}</span>
            </div>
          )}
          {height >= 72 && (
            <div className="flex items-center gap-2 text-[10px]" style={{ color: `${color}99` }}>
              <span>{cls.enrolled}/{cls.capacity}</span>
              {isFull && (
                <span
                  className="rounded px-1 py-px text-[9px] font-bold leading-tight text-white"
                  style={{ backgroundColor: "#EF4444" }}
                >
                  FULL
                </span>
              )}
            </div>
          )}
        </div>
      </button>
    );
  };

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen flex-col" style={{ backgroundColor: "var(--pa-bg-base)", color: "var(--pa-text-primary)" }}>
      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <div
        className="flex shrink-0 flex-col gap-4 border-b px-6 py-4"
        style={{ borderColor: "var(--pa-border-default)", backgroundColor: "var(--pa-bg-surface)" }}
      >
        {/* Top row */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold" style={{ color: "var(--pa-text-primary)" }}>
              Yoga Schedule
            </h1>
            <p className="mt-0.5 text-sm" style={{ color: "var(--pa-text-muted)" }}>
              {formatWeekRange(currentMonday)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View toggle */}
            <div
              className="flex overflow-hidden rounded-lg border"
              style={{ borderColor: "var(--pa-border-default)" }}
            >
              <button
                onClick={() => setViewMode("week")}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition duration-100 ease-linear"
                style={{
                  backgroundColor: viewMode === "week" ? "var(--pa-bg-elevated)" : "transparent",
                  color: viewMode === "week" ? "var(--pa-text-primary)" : "var(--pa-text-muted)",
                }}
              >
                <LayoutGrid01 className="size-3.5" />
                Week View
              </button>
              <button
                onClick={() => setViewMode("list")}
                className="flex items-center gap-1.5 border-l px-3 py-1.5 text-xs font-medium transition duration-100 ease-linear"
                style={{
                  borderColor: "var(--pa-border-default)",
                  backgroundColor: viewMode === "list" ? "var(--pa-bg-elevated)" : "transparent",
                  color: viewMode === "list" ? "var(--pa-text-primary)" : "var(--pa-text-muted)",
                }}
              >
                <List className="size-3.5" />
                Class List
              </button>
            </div>

            {/* Week nav */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigateWeek(-1)}
                className="rounded-lg p-1.5 transition duration-100 ease-linear"
                style={{ color: "var(--pa-text-secondary)" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--pa-bg-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                onClick={goToToday}
                className="rounded-lg px-2.5 py-1 text-xs font-medium transition duration-100 ease-linear"
                style={{
                  backgroundColor: isCurrentWeek ? "#14B8A6" : "transparent",
                  color: isCurrentWeek ? "#fff" : "var(--pa-text-secondary)",
                  border: isCurrentWeek ? "none" : "1px solid var(--pa-border-default)",
                }}
              >
                This Week
              </button>
              <button
                onClick={() => navigateWeek(1)}
                className="rounded-lg p-1.5 transition duration-100 ease-linear"
                style={{ color: "var(--pa-text-secondary)" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--pa-bg-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter strip */}
        <div className="flex items-center gap-3">
          <FilterLines className="size-4 shrink-0" style={{ color: "var(--pa-text-muted)" }} />

          {/* Instructor filter */}
          <select
            value={instructorFilter}
            onChange={(e) => setInstructorFilter(e.target.value)}
            className="rounded-lg border px-2.5 py-1.5 text-xs"
            style={{
              borderColor: "var(--pa-border-default)",
              backgroundColor: "var(--pa-bg-base)",
              color: "var(--pa-text-secondary)",
            }}
          >
            <option>All Instructors</option>
            {INSTRUCTORS.map((i) => (
              <option key={i}>{i}</option>
            ))}
          </select>

          {/* Room filter */}
          <select
            value={roomFilter}
            onChange={(e) => setRoomFilter(e.target.value)}
            className="rounded-lg border px-2.5 py-1.5 text-xs"
            style={{
              borderColor: "var(--pa-border-default)",
              backgroundColor: "var(--pa-bg-base)",
              color: "var(--pa-text-secondary)",
            }}
          >
            <option>All Rooms</option>
            {ROOMS.map((r) => (
              <option key={r}>{r} Studio</option>
            ))}
          </select>

          {/* Style pills */}
          <div className="flex items-center gap-1.5">
            {STYLES_FILTER.map((s) => {
              const isActive = styleFilter === s;
              const pillColor = s === "All" ? "#14B8A6" : getStyleColor(s);
              return (
                <button
                  key={s}
                  onClick={() => setStyleFilter(s)}
                  className="rounded-full px-2.5 py-1 text-xs font-medium transition duration-100 ease-linear"
                  style={{
                    backgroundColor: isActive ? `${pillColor}25` : "transparent",
                    color: isActive ? pillColor : "var(--pa-text-muted)",
                    border: isActive ? `1px solid ${pillColor}50` : "1px solid transparent",
                  }}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Main Content ───────────────────────────────────────────────── */}
      <div className="flex min-h-0 flex-1">
        {/* Schedule area */}
        <div className="flex min-h-0 flex-1 flex-col">
          {viewMode === "week" ? (
            <WeekView
              classes={filteredClasses}
              weekDates={weekDates}
              todayIndex={todayIndex}
              isCurrentWeek={isCurrentWeek}
              currentTimeOffset={currentTimeOffset}
              gridRef={gridRef}
              ClassBlock={ClassBlock}
            />
          ) : (
            <ListView
              classes={filteredClasses}
              onSelect={setSelectedClass}
              selectedId={selectedClass?.id ?? null}
            />
          )}
        </div>

        {/* ─── Detail Panel ───────────────────────────────────────────── */}
        {selectedClass && (
          <DetailPanel cls={selectedClass} onClose={() => setSelectedClass(null)} />
        )}
      </div>
    </div>
  );
}

// ─── Week View ────────────────────────────────────────────────────────────────

function WeekView({
  classes,
  weekDates,
  todayIndex,
  isCurrentWeek,
  currentTimeOffset,
  gridRef,
  ClassBlock,
}: {
  classes: YogaClass[];
  weekDates: Date[];
  todayIndex: number;
  isCurrentWeek: boolean;
  currentTimeOffset: number | null;
  gridRef: React.RefObject<HTMLDivElement | null>;
  ClassBlock: React.ComponentType<{ cls: YogaClass }>;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Day headers */}
      <div className="flex shrink-0 border-b" style={{ borderColor: "var(--pa-border-default)" }}>
        <div
          className="w-16 shrink-0 border-r"
          style={{ borderColor: "var(--pa-border-default)", backgroundColor: "var(--pa-bg-surface)" }}
        />
        {DAY_LABELS.map((label, i) => {
          const isToday = isCurrentWeek && i === todayIndex;
          return (
            <div
              key={label}
              className="flex flex-1 flex-col items-center border-r py-2.5"
              style={{
                borderColor: "var(--pa-border-subtle)",
                backgroundColor: isToday ? "rgba(20, 184, 166, 0.05)" : "var(--pa-bg-surface)",
              }}
            >
              <span className="text-[11px] font-medium" style={{ color: "var(--pa-text-muted)" }}>
                {label}
              </span>
              <span
                className="mt-0.5 flex size-6 items-center justify-center rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: isToday ? "#14B8A6" : "transparent",
                  color: isToday ? "#fff" : "var(--pa-text-primary)",
                }}
              >
                {weekDates[i].getDate()}
              </span>
            </div>
          );
        })}
      </div>

      {/* Time grid */}
      <div className="relative flex flex-1 overflow-auto" ref={gridRef}>
        {/* Time labels */}
        <div
          className="sticky left-0 z-10 w-16 shrink-0 border-r"
          style={{ borderColor: "var(--pa-border-default)", backgroundColor: "var(--pa-bg-base)" }}
        >
          {HOUR_LABELS.map((hour) => (
            <div
              key={hour}
              className="flex items-start justify-end pr-3 text-[11px]"
              style={{ height: `${ROW_HEIGHT * 2}px`, color: "var(--pa-text-muted)" }}
            >
              <span className="-translate-y-2">{hour}</span>
            </div>
          ))}
        </div>

        {/* Grid columns */}
        <div className="relative flex flex-1">
          {DAY_LABELS.map((label, dayIdx) => {
            const dayClasses = classes.filter((c) => c.day === dayIdx);
            const isToday = isCurrentWeek && dayIdx === todayIndex;
            return (
              <div
                key={label}
                className="relative flex-1 border-r"
                style={{
                  borderColor: "var(--pa-border-subtle)",
                  backgroundColor: isToday ? "rgba(20, 184, 166, 0.03)" : "transparent",
                }}
              >
                {/* Row lines */}
                {HALF_HOUR_SLOTS.map((slot, i) => (
                  <div
                    key={slot}
                    className="border-b"
                    style={{
                      height: `${ROW_HEIGHT}px`,
                      borderColor: i % 2 === 0 ? "var(--pa-border-default)" : "var(--pa-border-subtle)",
                    }}
                  />
                ))}

                {/* Class blocks */}
                <div className="absolute inset-0">
                  {dayClasses.map((cls) => (
                    <ClassBlock key={cls.id} cls={cls} />
                  ))}
                </div>
              </div>
            );
          })}

          {/* Current time indicator */}
          {isCurrentWeek && currentTimeOffset !== null && (
            <div
              className="pointer-events-none absolute right-0 left-0 z-20 flex items-center"
              style={{ top: `${currentTimeOffset}px` }}
            >
              <div className="size-2 rounded-full" style={{ backgroundColor: "#EF4444" }} />
              <div className="h-px flex-1" style={{ backgroundColor: "#EF4444" }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── List View ────────────────────────────────────────────────────────────────

function ListView({
  classes,
  onSelect,
  selectedId,
}: {
  classes: YogaClass[];
  onSelect: (cls: YogaClass) => void;
  selectedId: number | null;
}) {
  const sorted = useMemo(() => {
    return [...classes].sort((a, b) => {
      if (a.day !== b.day) return a.day - b.day;
      return timeToMinutes(a.time) - timeToMinutes(b.time);
    });
  }, [classes]);

  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full">
        <thead>
          <tr
            className="sticky top-0 z-10 text-left text-xs font-medium"
            style={{ backgroundColor: "var(--pa-bg-surface)", color: "var(--pa-text-muted)" }}
          >
            <th className="border-b px-4 py-3 font-medium" style={{ borderColor: "var(--pa-border-default)" }}>
              Day / Time
            </th>
            <th className="border-b px-4 py-3 font-medium" style={{ borderColor: "var(--pa-border-default)" }}>
              Class
            </th>
            <th className="border-b px-4 py-3 font-medium" style={{ borderColor: "var(--pa-border-default)" }}>
              Instructor
            </th>
            <th className="border-b px-4 py-3 font-medium" style={{ borderColor: "var(--pa-border-default)" }}>
              Room
            </th>
            <th className="border-b px-4 py-3 font-medium" style={{ borderColor: "var(--pa-border-default)" }}>
              Enrolled
            </th>
            <th className="border-b px-4 py-3 font-medium" style={{ borderColor: "var(--pa-border-default)" }}>
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((cls) => {
            const color = getStyleColor(cls.style);
            const isFull = cls.enrolled >= cls.capacity;
            const pct = Math.round((cls.enrolled / cls.capacity) * 100);
            const isSelected = selectedId === cls.id;

            return (
              <tr
                key={cls.id}
                onClick={() => onSelect(cls)}
                className="cursor-pointer text-sm transition duration-100 ease-linear"
                style={{
                  backgroundColor: isSelected ? `${color}10` : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = "var(--pa-bg-hover)";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <td className="border-b px-4 py-3" style={{ borderColor: "var(--pa-border-subtle)" }}>
                  <div className="font-medium" style={{ color: "var(--pa-text-primary)" }}>
                    {DAY_LABELS[cls.day]}
                  </div>
                  <div className="text-xs" style={{ color: "var(--pa-text-muted)" }}>
                    {cls.time} – {minutesToTime(timeToMinutes(cls.time) + cls.duration)}
                  </div>
                </td>
                <td className="border-b px-4 py-3" style={{ borderColor: "var(--pa-border-subtle)" }}>
                  <div className="flex items-center gap-2">
                    <div
                      className="size-2 shrink-0 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-medium" style={{ color: "var(--pa-text-primary)" }}>
                      {cls.name}
                    </span>
                    {cls.isFree && (
                      <span
                        className="rounded px-1.5 py-0.5 text-[10px] font-bold text-white"
                        style={{ backgroundColor: color }}
                      >
                        FREE
                      </span>
                    )}
                  </div>
                </td>
                <td className="border-b px-4 py-3" style={{ borderColor: "var(--pa-border-subtle)" }}>
                  <div className="flex items-center gap-2">
                    <div
                      className="flex size-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
                      style={{ backgroundColor: color }}
                    >
                      {cls.initials}
                    </div>
                    <span style={{ color: "var(--pa-text-secondary)" }}>{cls.instructor}</span>
                  </div>
                </td>
                <td className="border-b px-4 py-3" style={{ borderColor: "var(--pa-border-subtle)", color: "var(--pa-text-secondary)" }}>
                  {cls.room} Studio
                </td>
                <td className="border-b px-4 py-3" style={{ borderColor: "var(--pa-border-subtle)" }}>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-1.5 w-16 overflow-hidden rounded-full"
                      style={{ backgroundColor: "var(--pa-border-subtle)" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: isFull ? "#EF4444" : color,
                        }}
                      />
                    </div>
                    <span className="text-xs" style={{ color: "var(--pa-text-muted)" }}>
                      {cls.enrolled}/{cls.capacity}
                    </span>
                  </div>
                </td>
                <td className="border-b px-4 py-3" style={{ borderColor: "var(--pa-border-subtle)" }}>
                  {isFull ? (
                    <span
                      className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold"
                      style={{ backgroundColor: "rgba(239, 68, 68, 0.15)", color: "#EF4444" }}
                    >
                      Full
                    </span>
                  ) : pct >= 80 ? (
                    <span
                      className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold"
                      style={{ backgroundColor: "rgba(245, 158, 11, 0.15)", color: "#F59E0B" }}
                    >
                      Filling up
                    </span>
                  ) : (
                    <span
                      className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold"
                      style={{ backgroundColor: "rgba(20, 184, 166, 0.15)", color: "#14B8A6" }}
                    >
                      Open
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function DetailPanel({ cls, onClose }: { cls: YogaClass; onClose: () => void }) {
  const color = getStyleColor(cls.style);
  const isFull = cls.enrolled >= cls.capacity;
  const pct = Math.round((cls.enrolled / cls.capacity) * 100);
  const endTime = minutesToTime(timeToMinutes(cls.time) + cls.duration);

  return (
    <div
      className="hidden w-80 shrink-0 flex-col overflow-auto border-l lg:flex"
      style={{ borderColor: "var(--pa-border-default)", backgroundColor: "var(--pa-bg-surface)" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between border-b p-4" style={{ borderColor: "var(--pa-border-default)" }}>
        <div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full" style={{ backgroundColor: color }} />
            <h2 className="text-base font-semibold" style={{ color: "var(--pa-text-primary)" }}>
              {cls.name}
            </h2>
          </div>
          {cls.isFree && (
            <span
              className="mt-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-bold text-white"
              style={{ backgroundColor: color }}
            >
              FREE CLASS
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1 transition duration-100 ease-linear"
          style={{ color: "var(--pa-text-muted)" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--pa-bg-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <XClose className="size-4" />
        </button>
      </div>

      {/* Details */}
      <div className="flex-1 space-y-4 p-4">
        {/* Schedule */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="size-4 shrink-0" style={{ color: "var(--pa-text-muted)" }} />
            <span style={{ color: "var(--pa-text-primary)" }}>
              {DAY_LABELS_FULL[cls.day]}, {cls.time} – {endTime}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="flex size-4 items-center justify-center text-xs" style={{ color: "var(--pa-text-muted)" }}>
              ⏱
            </span>
            <span style={{ color: "var(--pa-text-secondary)" }}>{cls.duration} minutes</span>
          </div>
        </div>

        {/* Instructor */}
        <div
          className="rounded-lg border p-3"
          style={{ borderColor: "var(--pa-border-subtle)", backgroundColor: "var(--pa-bg-base)" }}
        >
          <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--pa-text-muted)" }}>
            Instructor
          </div>
          <div className="flex items-center gap-2.5">
            <div
              className="flex size-8 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: color }}
            >
              {cls.initials}
            </div>
            <div>
              <div className="text-sm font-medium" style={{ color: "var(--pa-text-primary)" }}>
                {cls.instructor}
              </div>
              <div className="text-xs" style={{ color: "var(--pa-text-muted)" }}>
                Yoga Instructor
              </div>
            </div>
          </div>
        </div>

        {/* Room */}
        <div
          className="rounded-lg border p-3"
          style={{ borderColor: "var(--pa-border-subtle)", backgroundColor: "var(--pa-bg-base)" }}
        >
          <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--pa-text-muted)" }}>
            Room
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MarkerPin01 className="size-4" style={{ color: "var(--pa-text-muted)" }} />
            <span style={{ color: "var(--pa-text-primary)" }}>{cls.room} Studio</span>
          </div>
        </div>

        {/* Enrollment */}
        <div
          className="rounded-lg border p-3"
          style={{ borderColor: "var(--pa-border-subtle)", backgroundColor: "var(--pa-bg-base)" }}
        >
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--pa-text-muted)" }}>
              Enrollment
            </div>
            {isFull ? (
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                style={{ backgroundColor: "rgba(239, 68, 68, 0.15)", color: "#EF4444" }}
              >
                FULL
              </span>
            ) : (
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                style={{ backgroundColor: `${color}20`, color }}
              >
                {cls.capacity - cls.enrolled} spots left
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Users01 className="size-4 shrink-0" style={{ color: "var(--pa-text-muted)" }} />
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: "var(--pa-text-primary)" }}>
                  {cls.enrolled} / {cls.capacity}
                </span>
                <span style={{ color: "var(--pa-text-muted)" }}>{pct}%</span>
              </div>
              <div
                className="mt-1.5 h-2 w-full overflow-hidden rounded-full"
                style={{ backgroundColor: "var(--pa-border-subtle)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: isFull ? "#EF4444" : color,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Style tag */}
        <div>
          <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--pa-text-muted)" }}>
            Style
          </div>
          <span
            className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
            style={{ backgroundColor: `${color}20`, color }}
          >
            <span className="mr-1.5 size-1.5 rounded-full" style={{ backgroundColor: color }} />
            {cls.style}
          </span>
        </div>
      </div>
    </div>
  );
}
