"use client";

import Link from "next/link";
import { Zap } from "@untitledui/icons";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col lg:flex-row">
      {/* Mobile logo */}
      <div className="flex items-center justify-center py-8 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5A4EFF]">
            <Zap className="size-5 text-white" />
          </div>
          <span className="text-xl font-bold text-[#FAFAFA]">PulseApp</span>
        </div>
      </div>

      {/* LEFT — For Personal Trainers */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-8 lg:p-16 bg-[#5A4EFF] overflow-hidden">
        {/* Subtle geometric pattern */}
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.3) 40px, rgba(255,255,255,0.3) 41px)`,
        }} />
        <div className="relative z-10 max-w-md w-full">
          <p className="mb-3 text-sm font-medium text-white/70 tracking-wide uppercase">For Personal Trainers</p>
          <h1 className="mb-4 text-3xl lg:text-4xl font-bold text-white leading-tight">Run your PT business from one place</h1>
          <p className="mb-6 text-base text-white/70 leading-relaxed">Bookings, clients, payments, programmes and growth tools — all in one app.</p>
          <div className="mb-8 flex flex-wrap gap-2">
            {["Smart scheduling", "Client management", "Automated payments"].map((f) => (
              <span key={f} className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white">{f}</span>
            ))}
          </div>
          <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-[#5A4EFF] transition hover:bg-white/90 active:scale-[0.97] w-full lg:w-auto justify-center">
            Go to Dashboard →
          </Link>
        </div>
      </div>

      {/* Desktop centre divider with logo */}
      <div className="hidden lg:flex items-center justify-center w-0 relative z-20">
        <div className="absolute flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0A0A0A] border border-[#262626] shadow-2xl">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5A4EFF]">
            <Zap className="size-5 text-white" />
          </div>
        </div>
      </div>

      {/* RIGHT — For Clients */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-8 lg:p-16 bg-[#111111] overflow-hidden">
        {/* Subtle accent */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#E2F4A6]/5 blur-[100px]" />
        <div className="relative z-10 max-w-md w-full">
          <p className="mb-3 text-sm font-medium text-[#E2F4A6] tracking-wide uppercase">For Clients</p>
          <h1 className="mb-4 text-3xl lg:text-4xl font-bold text-[#FAFAFA] leading-tight">Your training, beautifully organised</h1>
          <p className="mb-6 text-base text-[#A1A1AA] leading-relaxed">See your workouts, track your progress, book sessions and stay connected with your trainer.</p>
          <div className="mb-8 flex flex-wrap gap-2">
            {["Your programme", "Progress tracking", "Book sessions"].map((f) => (
              <span key={f} className="rounded-full bg-[#E2F4A6]/10 px-3 py-1.5 text-xs font-medium text-[#E2F4A6]">{f}</span>
            ))}
          </div>
          <Link href="/client" className="inline-flex items-center gap-2 rounded-xl bg-[#E2F4A6] px-6 py-3.5 text-sm font-semibold text-[#111111] transition hover:bg-[#E2F4A6]/90 active:scale-[0.97] w-full lg:w-auto justify-center">
            Go to My App →
          </Link>
        </div>
      </div>
    </div>
  );
}
