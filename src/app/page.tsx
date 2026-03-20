"use client";

import Link from "next/link";
import { Zap } from "@untitledui/icons";

const niches = [
  {
    title: "Personal Training",
    subtitle: "For Personal Trainers",
    description:
      "Manage clients, programmes, bookings, payments and growth — all in one place.",
    tags: ["Smart scheduling", "Client management", "Automated payments"],
    ctaLabel: "PT Dashboard →",
    ctaHref: "/dashboard",
    clientLabel: "Client App →",
    clientHref: "/client",
    color: "#5A4EFF",
    emoji: "🏋️",
  },
  {
    title: "Hair Salon",
    subtitle: "For Salon Owners",
    description:
      "Multi-stylist scheduling, colour formulas, walk-in queue, inventory and tip collection.",
    tags: ["Multi-stylist calendar", "Walk-in queue", "Colour formulas"],
    ctaLabel: "Salon Dashboard →",
    ctaHref: "/salon/dashboard",
    clientLabel: "Client App →",
    clientHref: "/salon-client",
    color: "#D946EF",
    emoji: "💇‍♀️",
  },
  {
    title: "Yoga Studio",
    subtitle: "For Yoga Instructors",
    description:
      "Class scheduling, member passes, workshops and retreat management.",
    tags: ["Class packs", "Workshop booking", "Member passes"],
    ctaLabel: "Yoga Dashboard →",
    ctaHref: "/yoga/dashboard",
    clientLabel: "Client App →",
    clientHref: "/yoga-client",
    color: "#14B8A6",
    emoji: "🧘",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--pa-bg-base)] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-center py-10">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#5A4EFF]">
            <Zap className="size-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--pa-text-primary)]">PulseApp</h1>
            <p className="text-xs text-[var(--pa-text-muted)]">
              Business Management Platform
            </p>
          </div>
        </div>
      </header>

      {/* Niche Cards */}
      <main className="flex-1 flex flex-col lg:flex-row items-stretch justify-center gap-6 px-6 pb-12 max-w-6xl mx-auto w-full">
        {niches.map((niche) => (
          <div
            key={niche.title}
            className="flex-1 rounded-3xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-8 flex flex-col overflow-hidden relative group transition-all duration-200 hover:border-opacity-50"
            style={{ borderColor: `${niche.color}30` }}
          >
            {/* Glow */}
            <div
              className="absolute -top-24 -right-24 w-48 h-48 rounded-full opacity-10 blur-[80px]"
              style={{ background: niche.color }}
            />

            <div className="relative z-10 flex flex-col flex-1">
              <span className="text-4xl mb-4">{niche.emoji}</span>
              <p
                className="text-xs font-medium uppercase tracking-wider mb-2"
                style={{ color: niche.color }}
              >
                {niche.subtitle}
              </p>
              <h2 className="text-2xl font-bold text-[var(--pa-text-primary)] mb-3">
                {niche.title}
              </h2>
              <p className="text-sm text-[var(--pa-text-secondary)] leading-relaxed mb-6">
                {niche.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {niche.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full px-3 py-1.5 text-xs font-medium"
                    style={{
                      background: `${niche.color}15`,
                      color: niche.color,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-auto space-y-3">
                <Link
                  href={niche.ctaHref}
                  className={`flex items-center justify-center rounded-xl px-6 py-3.5 text-sm font-semibold text-white transition duration-100 ease-linear hover:opacity-90 active:scale-[0.97] w-full `}
                  style={{ background: niche.color }}
                >
                  {niche.ctaLabel}
                </Link>
                {niche.clientHref && (
                  <Link
                    href={niche.clientHref}
                    className="flex items-center justify-center rounded-xl border px-6 py-3 text-sm font-medium transition duration-100 ease-linear hover:bg-white/5 w-full"
                    style={{
                      borderColor: `${niche.color}40`,
                      color: niche.color,
                    }}
                  >
                    {niche.clientLabel}
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-xs text-[var(--pa-text-muted)]">
          PulseApp — Multi-niche business management
        </p>
      </footer>
    </div>
  );
}
