"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  CheckCircle,
  ChevronRight,
  XClose,
  Edit05,
  CreditCard02,
  User01,
  Mail01,
  Phone,
  File06,
  ArrowLeft,
  Plus,
  MarkerPin01,
} from "@untitledui/icons";

/* ─── mock data ─── */
const services = [
  { id: "pt", name: "Personal Training", price: "R350", duration: "60 min", emoji: "🏋️" },
  { id: "hiit", name: "HIIT Class", price: "R120", duration: "45 min", emoji: "🔥" },
  { id: "yoga", name: "Yoga Flow", price: "R100", duration: "60 min", emoji: "🧘" },
  { id: "boxing", name: "Boxing", price: "R150", duration: "45 min", emoji: "🥊" },
  { id: "nutrition", name: "Nutrition Consult", price: "R450", duration: "45 min", emoji: "🥗" },
  { id: "assessment", name: "Fitness Assessment", price: "R300", duration: "30 min", emoji: "📋" },
];

const timeSlots = ["07:00", "08:00", "09:00", "10:00", "14:00", "16:00"];

const upcomingSessions = [
  { id: 1, day: "Thu", date: "20 Mar", time: "10:00", location: "PT Home Studio" },
  { id: 2, day: "Mon", date: "24 Mar", time: "09:00", location: "PT Home Studio" },
];

const steps = ["Service", "Date & Time", "Details", "Confirm"];

export default function BookSessionPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [useCredit, setUseCredit] = useState(false);
  const [name, setName] = useState("Kefilwe Sithole");
  const [email, setEmail] = useState("kefilwe@email.com");
  const [phone, setPhone] = useState("+27 82 345 6789");
  const [notes, setNotes] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const service = services.find((s) => s.id === selectedService);

  const canProceed = () => {
    if (currentStep === 1) return !!selectedService;
    if (currentStep === 2) return !!selectedDate && !!selectedTime;
    if (currentStep === 3) return !!name && !!email && !!phone;
    return true;
  };

  return (
    <div className="px-4 py-6 space-y-6">
      {/* ─── Credits Status Card ─── */}
      <div className="rounded-2xl border border-[#262626] bg-[#141414] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[#A1A1AA]">Your PT Package</p>
            <p className="mt-1 text-lg font-bold text-[#FAFAFA]">4 of 10 sessions remaining</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5A4EFF]/15">
            <CreditCard02 className="size-5 text-[#5A4EFF]" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#262626]">
            <div className="h-full w-[40%] rounded-full bg-[#5A4EFF]" />
          </div>
          <div className="flex items-center justify-between text-xs text-[#71717A]">
            <span>4 remaining</span>
            <button className="text-[#5A4EFF] hover:underline">Top up sessions</button>
          </div>
        </div>
      </div>

      {/* ─── Upcoming Sessions ─── */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-[#FAFAFA]">Upcoming Sessions</h2>
        {upcomingSessions.map((s) => (
          <div key={s.id} className="flex items-center justify-between rounded-xl border border-[#262626] bg-[#141414] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 flex-col items-center justify-center rounded-lg bg-[#5A4EFF]/10 text-[#5A4EFF]">
                <span className="text-[10px] font-bold uppercase leading-none">{s.day}</span>
                <span className="text-sm font-bold leading-tight">{s.date.split(" ")[0]}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-[#FAFAFA]">{s.time}</p>
                <p className="flex items-center gap-1 text-xs text-[#71717A]">
                  <MarkerPin01 className="size-3" /> {s.location}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-lg border border-[#262626] px-3 py-1.5 text-xs font-medium text-[#A1A1AA] transition hover:bg-[#1A1A1A]">Cancel</button>
              <button className="rounded-lg border border-[#262626] px-3 py-1.5 text-xs font-medium text-[#A1A1AA] transition hover:bg-[#1A1A1A]">Reschedule</button>
            </div>
          </div>
        ))}
        <p className="text-[11px] text-[#52525B]">Reschedule is free up to 24 hours before.</p>
      </div>

      {/* ─── Booking Flow ─── */}
      <div className="space-y-5">
        <h2 className="text-sm font-semibold text-[#FAFAFA]">Book a Session</h2>

        {/* Step indicator */}
        <div className="flex items-center gap-1">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center gap-1">
              <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
                i + 1 === currentStep ? "bg-[#5A4EFF] text-white" : i + 1 < currentStep ? "bg-[#5A4EFF]/20 text-[#5A4EFF]" : "bg-[#1A1A1A] text-[#52525B]"
              }`}>
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/10 text-[10px]">{i + 1}</span>
                {label}
              </div>
              {i < steps.length - 1 && <ChevronRight className="size-3 text-[#333]" />}
            </div>
          ))}
        </div>

        {/* ─── STEP 1: Service ─── */}
        {currentStep === 1 && (
          <div className="grid grid-cols-2 gap-3">
            {services.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedService(s.id)}
                className={`rounded-xl border p-4 text-left transition ${
                  selectedService === s.id ? "border-[#5A4EFF] bg-[#5A4EFF]/10" : "border-[#262626] bg-[#141414] hover:border-[#333]"
                }`}
              >
                <span className="text-2xl">{s.emoji}</span>
                <p className="mt-2 text-sm font-semibold text-[#FAFAFA]">{s.name}</p>
                <p className="mt-0.5 text-xs text-[#71717A]">{s.duration}</p>
                <p className="mt-2 text-sm font-bold text-[#5A4EFF]">{s.price}</p>
              </button>
            ))}
          </div>
        )}

        {/* ─── STEP 2: Date & Time ─── */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#A1A1AA]">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full rounded-xl border border-[#262626] bg-[#141414] px-4 py-3 text-sm text-[#FAFAFA] outline-none focus:border-[#5A4EFF] [color-scheme:dark]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#A1A1AA]">Select Time</label>
              <div className="flex flex-wrap gap-2">
                {timeSlots.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={`rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                      selectedTime === t ? "bg-[#5A4EFF] text-white" : "bg-[#1A1A1A] text-[#A1A1AA] hover:bg-[#222]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Use credit toggle */}
            <div className="rounded-xl border border-[#262626] bg-[#141414] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#FAFAFA]">Use session credit</p>
                  <p className="text-xs text-[#71717A]">Pay with your PT Package</p>
                </div>
                <button
                  onClick={() => setUseCredit(!useCredit)}
                  className={`relative h-6 w-11 rounded-full transition ${useCredit ? "bg-[#5A4EFF]" : "bg-[#333]"}`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${useCredit ? "translate-x-5.5" : "translate-x-0.5"}`} />
                </button>
              </div>
              {useCredit && (
                <p className="mt-3 rounded-lg bg-[#E2F4A6]/10 px-3 py-2 text-xs font-medium text-[#E2F4A6]">
                  Covered by PT Package (4 &rarr; 3 remaining)
                </p>
              )}
            </div>
          </div>
        )}

        {/* ─── STEP 3: Details ─── */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#A1A1AA]">Full Name</label>
              <div className="flex items-center gap-2 rounded-xl border border-[#262626] bg-[#141414] px-4 py-3">
                <User01 className="size-4 text-[#52525B]" />
                <input value={name} onChange={(e) => setName(e.target.value)} className="flex-1 bg-transparent text-sm text-[#FAFAFA] outline-none" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#A1A1AA]">Email</label>
              <div className="flex items-center gap-2 rounded-xl border border-[#262626] bg-[#141414] px-4 py-3">
                <Mail01 className="size-4 text-[#52525B]" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 bg-transparent text-sm text-[#FAFAFA] outline-none" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#A1A1AA]">Phone</label>
              <div className="flex items-center gap-2 rounded-xl border border-[#262626] bg-[#141414] px-4 py-3">
                <Phone className="size-4 text-[#52525B]" />
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="flex-1 bg-transparent text-sm text-[#FAFAFA] outline-none" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#A1A1AA]">Notes for your trainer</label>
              <div className="flex items-start gap-2 rounded-xl border border-[#262626] bg-[#141414] px-4 py-3">
                <File06 className="mt-0.5 size-4 text-[#52525B]" />
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any injuries, preferences, goals..."
                  rows={3}
                  className="flex-1 resize-none bg-transparent text-sm text-[#FAFAFA] placeholder-[#52525B] outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ─── STEP 4: Confirm ─── */}
        {currentStep === 4 && !confirmed && (
          <div className="space-y-4">
            <div className="rounded-xl border border-[#262626] bg-[#141414] p-5 space-y-3">
              <p className="text-xs font-medium uppercase tracking-wider text-[#71717A]">Booking Summary</p>
              <div className="space-y-2">
                {[
                  ["Service", `${service?.emoji} ${service?.name}`],
                  ["Date", selectedDate],
                  ["Time", selectedTime],
                  ["Duration", service?.duration],
                  ["Payment", useCredit ? "PT Package Credit" : service?.price],
                  ["Name", name],
                  ["Email", email],
                  ["Phone", phone],
                ].map(([label, val]) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="text-[#71717A]">{label}</span>
                    <span className="font-medium text-[#FAFAFA]">{val}</span>
                  </div>
                ))}
                {notes && (
                  <div className="border-t border-[#262626] pt-2">
                    <p className="text-xs text-[#71717A]">Notes</p>
                    <p className="text-sm text-[#FAFAFA]">{notes}</p>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setConfirmed(true)}
              className="w-full rounded-xl bg-[#5A4EFF] py-3.5 text-sm font-semibold text-white transition hover:bg-[#4F44E6]"
            >
              Confirm Booking
            </button>
          </div>
        )}

        {/* ─── Success ─── */}
        {confirmed && (
          <div className="flex flex-col items-center py-10 text-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E2F4A6]/15">
              <CheckCircle className="size-8 text-[#E2F4A6]" />
            </div>
            <h3 className="text-xl font-bold text-[#FAFAFA]">Booking confirmed!</h3>
            <p className="text-sm text-[#71717A]">
              {service?.name} on {selectedDate} at {selectedTime}
            </p>
            <button className="rounded-xl border border-[#262626] bg-[#141414] px-6 py-3 text-sm font-medium text-[#FAFAFA] transition hover:bg-[#1A1A1A]">
              <Calendar className="mr-2 inline size-4" />
              Add to Calendar
            </button>
          </div>
        )}

        {/* ─── Nav Buttons ─── */}
        {!confirmed && (
          <div className="flex items-center gap-3">
            {currentStep > 1 && (
              <button onClick={() => setCurrentStep(currentStep - 1)} className="flex items-center gap-1 rounded-xl border border-[#262626] px-5 py-3 text-sm font-medium text-[#A1A1AA] transition hover:bg-[#1A1A1A]">
                <ArrowLeft className="size-4" /> Back
              </button>
            )}
            {currentStep < 4 && (
              <button
                onClick={() => canProceed() && setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
                className="flex-1 rounded-xl bg-[#5A4EFF] py-3 text-sm font-semibold text-white transition hover:bg-[#4F44E6] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
