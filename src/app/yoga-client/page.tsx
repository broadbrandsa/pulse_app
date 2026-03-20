"use client";

import Link from "next/link";
import {
  Calendar,
  Clock,
  MarkerPin01,
  ChevronRight,
  NavigationPointer01,
  Gift01,
  Award01,
  Star01,
  Activity,
  BookOpen01,
  XClose,
  Lightbulb02,
  MessageCircle01,
} from "@untitledui/icons";

const nextClass = {
  name: "Hot Yoga Flow",
  date: "Thu 20 Mar",
  time: "18:00 - 19:00",
  instructor: "Amahle",
  room: "Flow Room",
  note: "Bring a towel and water. Room is heated to 37\u00B0C.",
};

const upcomingClasses = [
  { id: 1, name: "Vinyasa Power", date: "Fri 21 Mar", time: "07:00", instructor: "Sipho", room: "Main Studio" },
  { id: 2, name: "Yin Restore", date: "Sat 22 Mar", time: "09:30", instructor: "Lerato", room: "Zen Room" },
];

const quickActions = [
  { name: "Browse Classes", icon: Calendar, href: "/yoga-client/schedule", color: "bg-[#14B8A6]" },
  { name: "My Practice", icon: Activity, href: "/yoga-client/practice", color: "bg-purple-500" },
  { name: "Workshops", icon: BookOpen01, href: "/yoga-client/schedule", color: "bg-amber-500" },
  { name: "My Rewards", icon: Gift01, href: "/yoga-client/profile", color: "bg-rose-500" },
];

const studioFeed = [
  { id: 1, title: "New Instructor Joining!", body: "Welcome Thabo, our new Ashtanga specialist, starting next week.", time: "2h ago" },
  { id: 2, title: "Workshop: Inversions 101", body: "Saturday 29 Mar, 14:00-16:00. Limited to 12 spots. Book now!", time: "1d ago" },
  { id: 3, title: "Studio Closed 27 Mar", body: "Ubuntu Yoga will be closed for Human Rights Day. Enjoy the long weekend!", time: "2d ago" },
];

const streakDays = [
  { day: "Fri", active: true },
  { day: "Sat", active: true },
  { day: "Sun", active: false },
  { day: "Mon", active: true },
  { day: "Tue", active: true },
  { day: "Wed", active: true },
  { day: "Thu", active: false },
];

export default function YogaClientHome() {
  return (
    <div className="space-y-6 px-4 py-6">
      {/* Hero Greeting */}
      <div>
        <h1 className="text-xl font-bold text-[var(--pa-text-primary)]">Namaste, Kefilwe {"\uD83D\uDE4F"}</h1>
        <p className="mt-1 text-sm text-[var(--pa-text-secondary)]">Your practice is your sanctuary</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/15 px-3 py-1 text-xs font-medium text-orange-400">
            {"\uD83D\uDD25"} 8-day streak
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#14B8A6]/15 px-3 py-1 text-xs font-medium text-[#14B8A6]">
            <Star01 className="size-3" />
            2,340 pts
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/15 px-3 py-1 text-xs font-medium text-purple-400">
            <Award01 className="size-3" />
            Yogi Tier
          </span>
        </div>
      </div>

      {/* Next Class Card */}
      <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[var(--pa-text-primary)]">Next Class</h2>
          <span className="rounded-full bg-[#14B8A6]/15 px-2.5 py-0.5 text-[10px] font-semibold text-[#14B8A6]">Today</span>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#14B8A6]/10 text-2xl">
            {"\uD83E\uDDD8\u200D\u2640\uFE0F"}
          </div>
          <div className="flex-1 space-y-1.5">
            <p className="text-sm font-semibold text-[var(--pa-text-primary)]">{nextClass.name}</p>
            <div className="flex items-center gap-1.5 text-xs text-[var(--pa-text-secondary)]">
              <Calendar className="size-3" />
              <span>{nextClass.date}, {nextClass.time}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[var(--pa-text-secondary)]">
              <Clock className="size-3" />
              <span>{nextClass.instructor} &middot; {nextClass.room}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[var(--pa-text-muted)]">
              <Lightbulb02 className="size-3" />
              <span>{nextClass.note}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[var(--pa-border-default)] bg-[var(--pa-bg-elevated)] px-3 py-2 text-xs font-medium text-[var(--pa-text-primary)] transition hover:bg-[var(--pa-bg-hover)]">
            <NavigationPointer01 className="size-3.5" />
            Get Directions
          </button>
          <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/20">
            <XClose className="size-3.5" />
            Cancel
          </button>
        </div>
      </div>

      {/* Practice Streak Card */}
      <div className="rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-transparent p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{"\uD83D\uDD25"}</span>
            <h2 className="text-sm font-semibold text-orange-400">8-day streak</h2>
          </div>
        </div>
        <div className="flex items-center justify-between gap-1">
          {streakDays.map((d) => (
            <div key={d.day} className="flex flex-col items-center gap-1.5">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${d.active ? "bg-orange-500 text-white" : "bg-[var(--pa-bg-elevated)] text-[var(--pa-text-muted)]"}`}>
                <span className="text-[10px] font-semibold">{d.day}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-[var(--pa-text-secondary)]">Attend today to reach 9!</p>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-[var(--pa-text-primary)]">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.name}
                href={action.href}
                className="flex items-center gap-3 rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-3.5 transition hover:bg-[var(--pa-bg-elevated)]"
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${action.color}`}>
                  <Icon className="size-4 text-white" />
                </div>
                <span className="text-xs font-medium text-[var(--pa-text-primary)]">{action.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Membership Status */}
      <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[var(--pa-text-primary)]">Membership</h2>
          <span className="rounded-full bg-green-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-green-400">Active</span>
        </div>
        <p className="text-sm font-medium text-[var(--pa-text-primary)]">Monthly Unlimited</p>
        <p className="mt-1 text-xs text-[var(--pa-text-muted)]">Renews 15 Apr &middot; R1,099/month</p>
        <Link href="/yoga-client/profile" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#14B8A6] transition hover:text-[#0D9488]">
          View Details
          <ChevronRight className="size-3" />
        </Link>
      </div>

      {/* Upcoming Classes */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[var(--pa-text-primary)]">Upcoming Classes</h2>
          <Link href="/yoga-client/schedule" className="text-xs font-medium text-[#14B8A6]">View All</Link>
        </div>
        <div className="space-y-2">
          {upcomingClasses.map((cls) => (
            <div key={cls.id} className="flex items-center justify-between rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#14B8A6]/10">
                  <Calendar className="size-4 text-[#14B8A6]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--pa-text-primary)]">{cls.name}</p>
                  <p className="text-xs text-[var(--pa-text-muted)]">{cls.date} &middot; {cls.time} &middot; {cls.instructor}</p>
                </div>
              </div>
              <span className="rounded-full bg-[#14B8A6]/15 px-2 py-0.5 text-[10px] font-semibold text-[#14B8A6]">Booked</span>
            </div>
          ))}
        </div>
      </div>

      {/* Studio Feed */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-[var(--pa-text-primary)]">Studio Feed</h2>
        <div className="space-y-2">
          {studioFeed.map((post) => (
            <div key={post.id} className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle01 className="size-4 text-[#14B8A6]" />
                  <p className="text-sm font-medium text-[var(--pa-text-primary)]">{post.title}</p>
                </div>
                <span className="text-[10px] text-[var(--pa-text-muted)]">{post.time}</span>
              </div>
              <p className="mt-1.5 text-xs text-[var(--pa-text-secondary)]">{post.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
