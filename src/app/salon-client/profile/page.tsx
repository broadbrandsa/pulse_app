"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Award01,
  Phone01,
  Mail01,
  Calendar,
  Clock,
  Scissors01,
  Heart,
  Bell01,
  LogOut01,
  ChevronRight,
  AlertCircle,
  User01,
} from "@untitledui/icons";

const personalInfo = {
  name: "Thandi Mokoena",
  phone: "+27 82 345 6789",
  email: "thandi.mokoena@gmail.com",
  birthday: "15 August 1995",
  memberSince: "January 2025",
};

const hairProfile = {
  type: "4C",
  texture: "Coily",
  porosity: "High",
  allergies: "None known",
  preferredProducts: "Cantu Shea Butter, Jamaican Black Castor Oil",
};

const notificationPrefs = [
  { id: "appointments", label: "Appointment Reminders", enabled: true },
  { id: "promotions", label: "Promotions & Offers", enabled: true },
  { id: "rewards", label: "Rewards Updates", enabled: true },
  { id: "products", label: "Product Recommendations", enabled: false },
];

export default function ProfilePage() {
  const [prefs, setPrefs] = useState(notificationPrefs);

  const togglePref = (id: string) => {
    setPrefs((prev) => prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)));
  };

  return (
    <div className="space-y-6 px-4 py-6">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#D946EF]/20 text-2xl font-bold text-[#D946EF] ring-4 ring-[#D946EF]/30">
          TM
        </div>
        <h1 className="mt-3 text-lg font-bold text-[var(--pa-text-primary)]">{personalInfo.name}</h1>
        <div className="mt-1 flex items-center gap-1.5">
          <Award01 className="size-3.5 text-amber-400" />
          <span className="text-xs font-semibold text-amber-400">Gold Member</span>
        </div>
        <p className="mt-0.5 text-xs text-[var(--pa-text-muted)]">Member since {personalInfo.memberSince}</p>
      </div>

      {/* Personal Info */}
      <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4">
        <h2 className="mb-3 text-sm font-semibold text-[var(--pa-text-primary)]">Personal Information</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Phone01 className="size-4 text-[var(--pa-text-muted)]" />
            <div>
              <p className="text-xs text-[var(--pa-text-muted)]">Phone</p>
              <p className="text-sm text-[var(--pa-text-primary)]">{personalInfo.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail01 className="size-4 text-[var(--pa-text-muted)]" />
            <div>
              <p className="text-xs text-[var(--pa-text-muted)]">Email</p>
              <p className="text-sm text-[var(--pa-text-primary)]">{personalInfo.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="size-4 text-[var(--pa-text-muted)]" />
            <div>
              <p className="text-xs text-[var(--pa-text-muted)]">Birthday</p>
              <p className="text-sm text-[var(--pa-text-primary)]">{personalInfo.birthday}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hair Profile */}
      <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4">
        <div className="mb-3 flex items-center gap-2">
          <Scissors01 className="size-4 text-[#D946EF]" />
          <h2 className="text-sm font-semibold text-[var(--pa-text-primary)]">Hair Profile</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-[var(--pa-bg-elevated)] p-3">
            <p className="text-xs text-[var(--pa-text-muted)]">Hair Type</p>
            <p className="mt-0.5 text-sm font-semibold text-[var(--pa-text-primary)]">{hairProfile.type}</p>
          </div>
          <div className="rounded-lg bg-[var(--pa-bg-elevated)] p-3">
            <p className="text-xs text-[var(--pa-text-muted)]">Texture</p>
            <p className="mt-0.5 text-sm font-semibold text-[var(--pa-text-primary)]">{hairProfile.texture}</p>
          </div>
          <div className="rounded-lg bg-[var(--pa-bg-elevated)] p-3">
            <p className="text-xs text-[var(--pa-text-muted)]">Porosity</p>
            <p className="mt-0.5 text-sm font-semibold text-[var(--pa-text-primary)]">{hairProfile.porosity}</p>
          </div>
          <div className="rounded-lg bg-[var(--pa-bg-elevated)] p-3">
            <p className="text-xs text-[var(--pa-text-muted)]">Allergies</p>
            <p className="mt-0.5 text-sm font-semibold text-[var(--pa-text-primary)]">{hairProfile.allergies}</p>
          </div>
        </div>
        <div className="mt-3 rounded-lg bg-[var(--pa-bg-elevated)] p-3">
          <p className="text-xs text-[var(--pa-text-muted)]">Preferred Products</p>
          <p className="mt-0.5 text-sm text-[var(--pa-text-primary)]">{hairProfile.preferredProducts}</p>
        </div>
      </div>

      {/* Appointment History Link */}
      <Link
        href="/salon-client"
        className="flex items-center justify-between rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4 transition hover:bg-[var(--pa-bg-elevated)]"
      >
        <div className="flex items-center gap-3">
          <Clock className="size-4 text-[var(--pa-text-muted)]" />
          <span className="text-sm font-medium text-[var(--pa-text-primary)]">Appointment History</span>
        </div>
        <ChevronRight className="size-4 text-[var(--pa-text-muted)]" />
      </Link>

      {/* Favourite Stylist */}
      <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4">
        <div className="mb-3 flex items-center gap-2">
          <Heart className="size-4 text-[#D946EF]" />
          <h2 className="text-sm font-semibold text-[var(--pa-text-primary)]">Favourite Stylist</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D946EF]/20 text-xs font-semibold text-[#D946EF]">
            NM
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--pa-text-primary)]">Naledi</p>
            <p className="text-xs text-[var(--pa-text-muted)]">Braids & Locs Specialist</p>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4">
        <div className="mb-3 flex items-center gap-2">
          <Bell01 className="size-4 text-[var(--pa-text-muted)]" />
          <h2 className="text-sm font-semibold text-[var(--pa-text-primary)]">Notification Preferences</h2>
        </div>
        <div className="space-y-3">
          {prefs.map((pref) => (
            <div key={pref.id} className="flex items-center justify-between">
              <span className="text-sm text-[var(--pa-text-secondary)]">{pref.label}</span>
              <button
                onClick={() => togglePref(pref.id)}
                className={`relative h-6 w-10 rounded-full transition ${pref.enabled ? "bg-[#D946EF]" : "bg-[var(--pa-border-default)]"}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${pref.enabled ? "translate-x-4" : "translate-x-0"}`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sign Out */}
      <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/5 py-3.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/10">
        <LogOut01 className="size-4" />
        Sign Out
      </button>
    </div>
  );
}
