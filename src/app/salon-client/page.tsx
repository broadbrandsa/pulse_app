"use client";

import Link from "next/link";
import {
  Calendar,
  Clock,
  Star01,
  MarkerPin01,
  ChevronRight,
  MessageSquare01,
  NavigationPointer01,
  ShoppingBag01,
  Gift01,
  Award01,
  Scissors01,
  Heart,
} from "@untitledui/icons";

const nextAppointment = {
  service: "Box Braids",
  emoji: "💇🏾‍♀️",
  date: "Saturday 22 March",
  time: "09:00",
  stylist: "Naledi",
  duration: "3 hours",
  location: "45 Vilakazi Street, Soweto",
};

const recentVisits = [
  { id: 1, service: "Box Braids", date: "17 Mar", price: "R850", rating: 5 },
  { id: 2, service: "Wash & Blow", date: "28 Feb", price: "R250", rating: 5 },
  { id: 3, service: "Treatment", date: "10 Feb", price: "R350", rating: 4 },
];

const quickActions = [
  { name: "Book Appointment", icon: Calendar, href: "/salon-client/book", color: "bg-[#D946EF]" },
  { name: "My Rewards", icon: Gift01, href: "/salon-client/rewards", color: "bg-amber-500" },
  { name: "Shop Products", icon: ShoppingBag01, href: "/salon-client/shop", color: "bg-emerald-500" },
  { name: "Messages", icon: MessageSquare01, href: "/salon-client/notifications", color: "bg-sky-500" },
];

export default function SalonClientHome() {
  return (
    <div className="space-y-6 px-4 py-6">
      {/* Hero Greeting */}
      <div>
        <h1 className="text-xl font-bold text-[var(--pa-text-primary)]">Good morning, Thandi</h1>
        <p className="mt-1 text-sm text-[var(--pa-text-secondary)]">Friday, 21 March 2026</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D946EF]/15 px-3 py-1 text-xs font-medium text-[#D946EF]">
            <Calendar className="size-3" />
            Next: Sat 9am
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-400">
            <Star01 className="size-3" />
            2,450 pts
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-400">
            <Award01 className="size-3" />
            Gold Tier
          </span>
        </div>
      </div>

      {/* Next Appointment Card */}
      <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[var(--pa-text-primary)]">Next Appointment</h2>
          <span className="rounded-full bg-[#D946EF]/15 px-2.5 py-0.5 text-[10px] font-semibold text-[#D946EF]">Tomorrow</span>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D946EF]/10 text-2xl">
            {nextAppointment.emoji}
          </div>
          <div className="flex-1 space-y-1.5">
            <p className="text-sm font-semibold text-[var(--pa-text-primary)]">{nextAppointment.service}</p>
            <div className="flex items-center gap-1.5 text-xs text-[var(--pa-text-secondary)]">
              <Calendar className="size-3" />
              <span>{nextAppointment.date}, {nextAppointment.time}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[var(--pa-text-secondary)]">
              <Clock className="size-3" />
              <span>{nextAppointment.duration} with {nextAppointment.stylist}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[var(--pa-text-secondary)]">
              <MarkerPin01 className="size-3" />
              <span>{nextAppointment.location}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[var(--pa-border-default)] bg-[var(--pa-bg-elevated)] px-3 py-2 text-xs font-medium text-[var(--pa-text-primary)] transition hover:bg-[var(--pa-bg-elevated)]">
            <NavigationPointer01 className="size-3.5" />
            Get Directions
          </button>
          <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#D946EF] px-3 py-2 text-xs font-medium text-white transition hover:bg-[#C026D3]">
            <MessageSquare01 className="size-3.5" />
            Message Stylist
          </button>
        </div>
      </div>

      {/* Loyalty Card */}
      <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-[#141414] p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award01 className="size-5 text-amber-400" />
            <h2 className="text-sm font-semibold text-amber-400">Gold Tier</h2>
          </div>
          <span className="text-lg font-bold text-[var(--pa-text-primary)]">2,450 <span className="text-xs font-normal text-[var(--pa-text-secondary)]">pts</span></span>
        </div>
        <div className="mb-2">
          <div className="flex items-center justify-between text-xs text-[var(--pa-text-secondary)]">
            <span>Progress to maintain Gold</span>
            <span className="text-amber-400">2,450 / 3,000</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--pa-border-default)]">
            <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400" style={{ width: "82%" }} />
          </div>
        </div>
        <Link href="/salon-client/rewards" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-amber-400 transition hover:text-amber-300">
          View Rewards
          <ChevronRight className="size-3" />
        </Link>
      </div>

      {/* Hair Profile Summary */}
      <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scissors01 className="size-4 text-[#D946EF]" />
            <h2 className="text-sm font-semibold text-[var(--pa-text-primary)]">Hair Profile</h2>
          </div>
          <Link href="/salon-client/profile" className="text-xs font-medium text-[#D946EF] transition hover:text-[#E879F9]">
            View Full Profile
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-[var(--pa-bg-elevated)] p-2.5 text-center">
            <p className="text-xs text-[var(--pa-text-muted)]">Type</p>
            <p className="mt-0.5 text-sm font-semibold text-[var(--pa-text-primary)]">4C</p>
          </div>
          <div className="rounded-lg bg-[var(--pa-bg-elevated)] p-2.5 text-center">
            <p className="text-xs text-[var(--pa-text-muted)]">Texture</p>
            <p className="mt-0.5 text-sm font-semibold text-[var(--pa-text-primary)]">Coily</p>
          </div>
          <div className="rounded-lg bg-[var(--pa-bg-elevated)] p-2.5 text-center">
            <p className="text-xs text-[var(--pa-text-muted)]">Last Treat</p>
            <p className="mt-0.5 text-sm font-semibold text-[var(--pa-text-primary)]">17 Mar</p>
          </div>
        </div>
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

      {/* Recent Visits */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-[var(--pa-text-primary)]">Recent Visits</h2>
        <div className="space-y-2">
          {recentVisits.map((visit) => (
            <div key={visit.id} className="flex items-center justify-between rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#D946EF]/10">
                  <Heart className="size-4 text-[#D946EF]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--pa-text-primary)]">{visit.service}</p>
                  <p className="text-xs text-[var(--pa-text-muted)]">{visit.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-[var(--pa-text-primary)]">{visit.price}</p>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: visit.rating }).map((_, i) => (
                    <Star01 key={i} className="size-3 text-amber-400" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
