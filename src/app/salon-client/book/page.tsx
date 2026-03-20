"use client";

import { useState } from "react";
import { ArrowLeft, Check, Clock, ChevronRight, User01 } from "@untitledui/icons";
import Link from "next/link";

interface Service {
  id: number;
  name: string;
  emoji: string;
  price: string;
  priceNum: number;
  duration: string;
  category: string;
}

const services: Service[] = [
  { id: 1, name: "Box Braids", emoji: "💇🏾‍♀️", price: "R850", priceNum: 850, duration: "3h", category: "Braids" },
  { id: 2, name: "Cornrows", emoji: "🌀", price: "R400", priceNum: 400, duration: "2h", category: "Braids" },
  { id: 3, name: "Wash & Blow", emoji: "💆🏾‍♀️", price: "R250", priceNum: 250, duration: "1h", category: "Wash" },
  { id: 4, name: "Treatment", emoji: "✨", price: "R350", priceNum: 350, duration: "1.5h", category: "Treatment" },
  { id: 5, name: "Relaxer", emoji: "🧴", price: "R300", priceNum: 300, duration: "2h", category: "Chemical" },
  { id: 6, name: "Colour", emoji: "🎨", price: "R500", priceNum: 500, duration: "2.5h", category: "Chemical" },
  { id: 7, name: "Loc Maintenance", emoji: "🔒", price: "R450", priceNum: 450, duration: "2h", category: "Locs" },
  { id: 8, name: "Silk Press", emoji: "🌟", price: "R350", priceNum: 350, duration: "1.5h", category: "Styling" },
  { id: 9, name: "Bantu Knots", emoji: "🌸", price: "R200", priceNum: 200, duration: "1h", category: "Styling" },
  { id: 10, name: "Wig Install", emoji: "👑", price: "R600", priceNum: 600, duration: "1.5h", category: "Install" },
  { id: 11, name: "Trim", emoji: "✂️", price: "R100", priceNum: 100, duration: "30m", category: "Cut" },
  { id: 12, name: "Deep Condition", emoji: "💧", price: "R200", priceNum: 200, duration: "45m", category: "Treatment" },
];

const stylists = [
  { id: 1, name: "Naledi", initials: "NM", available: true, speciality: "Braids & Locs" },
  { id: 2, name: "Zinhle", initials: "ZD", available: true, speciality: "Colour & Chemical" },
  { id: 3, name: "Buhle", initials: "BN", available: false, speciality: "Styling & Installs" },
];

const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStylist, setSelectedStylist] = useState<(typeof stylists)[0] | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [booked, setBooked] = useState(false);

  const canProceedStep2 = selectedService !== null;
  const canProceedStep3 = selectedDate && selectedStylist && selectedTime;

  if (booked) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#D946EF]/20">
          <Check className="size-8 text-[#D946EF]" />
        </div>
        <h1 className="text-xl font-bold text-[var(--pa-text-primary)]">Booking Confirmed!</h1>
        <p className="mt-2 text-sm text-[var(--pa-text-secondary)]">
          {selectedService?.name} with {selectedStylist?.name}
        </p>
        <p className="text-sm text-[var(--pa-text-secondary)]">
          {selectedDate} at {selectedTime}
        </p>
        <p className="mt-1 text-lg font-bold text-[#D946EF]">{selectedService?.price}</p>
        <p className="mt-4 text-xs text-[var(--pa-text-muted)]">
          You&apos;ll earn {Math.floor((selectedService?.priceNum ?? 0) / 10)} loyalty points for this visit!
        </p>
        <Link
          href="/salon-client"
          className="mt-6 rounded-xl bg-[#D946EF] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#C026D3]"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        {step > 1 ? (
          <button onClick={() => setStep(step - 1)} className="rounded-lg p-1.5 text-[var(--pa-text-secondary)] transition hover:bg-[var(--pa-bg-elevated)] hover:text-[var(--pa-text-primary)]">
            <ArrowLeft className="size-5" />
          </button>
        ) : (
          <Link href="/salon-client" className="rounded-lg p-1.5 text-[var(--pa-text-secondary)] transition hover:bg-[var(--pa-bg-elevated)] hover:text-[var(--pa-text-primary)]">
            <ArrowLeft className="size-5" />
          </Link>
        )}
        <div>
          <h1 className="text-lg font-bold text-[var(--pa-text-primary)]">Book Appointment</h1>
          <p className="text-xs text-[var(--pa-text-muted)]">Step {step} of 3</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6 flex gap-1.5">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`h-1 flex-1 rounded-full transition ${s <= step ? "bg-[#D946EF]" : "bg-[var(--pa-border-default)]"}`} />
        ))}
      </div>

      {/* Step 1: Service Selection */}
      {step === 1 && (
        <div>
          <h2 className="mb-4 text-sm font-semibold text-[var(--pa-text-primary)]">Choose a Service</h2>
          <div className="grid grid-cols-2 gap-2.5">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => setSelectedService(service)}
                className={`flex flex-col items-start rounded-xl border p-3.5 text-left transition ${
                  selectedService?.id === service.id
                    ? "border-[#D946EF] bg-[#D946EF]/10"
                    : "border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] hover:border-[var(--pa-border-emphasis)]"
                }`}
              >
                <span className="text-2xl">{service.emoji}</span>
                <p className="mt-2 text-sm font-medium text-[var(--pa-text-primary)]">{service.name}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#D946EF]">{service.price}</span>
                  <span className="flex items-center gap-0.5 text-xs text-[var(--pa-text-muted)]">
                    <Clock className="size-3" />
                    {service.duration}
                  </span>
                </div>
              </button>
            ))}
          </div>
          <button
            disabled={!canProceedStep2}
            onClick={() => setStep(2)}
            className="mt-6 w-full rounded-xl bg-[#D946EF] py-3 text-sm font-semibold text-white transition hover:bg-[#C026D3] disabled:opacity-40 disabled:hover:bg-[#D946EF]"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 2: Date, Time & Stylist */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Date */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--pa-text-primary)]">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] px-4 py-3 text-sm text-[var(--pa-text-primary)] outline-none focus:border-[#D946EF] [color-scheme:dark]"
            />
          </div>

          {/* Stylist */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--pa-text-primary)]">Choose Stylist</label>
            <div className="space-y-2">
              {stylists.map((stylist) => (
                <button
                  key={stylist.id}
                  disabled={!stylist.available}
                  onClick={() => setSelectedStylist(stylist)}
                  className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition ${
                    selectedStylist?.id === stylist.id
                      ? "border-[#D946EF] bg-[#D946EF]/10"
                      : stylist.available
                        ? "border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] hover:border-[var(--pa-border-emphasis)]"
                        : "border-[var(--pa-border-subtle)] bg-[#0F0F0F] opacity-50"
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D946EF]/20 text-xs font-semibold text-[#D946EF]">
                    {stylist.initials}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-[var(--pa-text-primary)]">{stylist.name}</p>
                      {stylist.available ? (
                        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-400">Available</span>
                      ) : (
                        <span className="rounded-full bg-zinc-500/15 px-2 py-0.5 text-[10px] font-medium text-[var(--pa-text-muted)]">Unavailable</span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--pa-text-muted)]">{stylist.speciality}</p>
                  </div>
                  <User01 className="size-4 text-zinc-600" />
                </button>
              ))}
            </div>
          </div>

          {/* Time Slots */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--pa-text-primary)]">Select Time</label>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  className={`rounded-lg border py-2.5 text-center text-sm font-medium transition ${
                    selectedTime === slot
                      ? "border-[#D946EF] bg-[#D946EF]/10 text-[#D946EF]"
                      : "border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] text-[var(--pa-text-secondary)] hover:border-[var(--pa-border-emphasis)]"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <button
            disabled={!canProceedStep3}
            onClick={() => setStep(3)}
            className="w-full rounded-xl bg-[#D946EF] py-3 text-sm font-semibold text-white transition hover:bg-[#C026D3] disabled:opacity-40 disabled:hover:bg-[#D946EF]"
          >
            Review Booking
          </button>
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && selectedService && selectedStylist && (
        <div>
          <h2 className="mb-4 text-sm font-semibold text-[var(--pa-text-primary)]">Confirm Your Booking</h2>
          <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5">
            <div className="mb-4 flex items-center gap-3">
              <span className="text-3xl">{selectedService.emoji}</span>
              <div>
                <p className="text-base font-bold text-[var(--pa-text-primary)]">{selectedService.name}</p>
                <p className="text-xs text-[var(--pa-text-secondary)]">{selectedService.category}</p>
              </div>
            </div>

            <div className="space-y-3 border-t border-[var(--pa-border-default)] pt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--pa-text-muted)]">Date</span>
                <span className="text-sm font-medium text-[var(--pa-text-primary)]">{selectedDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--pa-text-muted)]">Time</span>
                <span className="text-sm font-medium text-[var(--pa-text-primary)]">{selectedTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--pa-text-muted)]">Stylist</span>
                <span className="text-sm font-medium text-[var(--pa-text-primary)]">{selectedStylist.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--pa-text-muted)]">Duration</span>
                <span className="text-sm font-medium text-[var(--pa-text-primary)]">{selectedService.duration}</span>
              </div>
              <div className="flex items-center justify-between border-t border-[var(--pa-border-default)] pt-3">
                <span className="text-sm font-semibold text-[var(--pa-text-secondary)]">Total</span>
                <span className="text-lg font-bold text-[#D946EF]">{selectedService.price}</span>
              </div>
            </div>

            <p className="mt-3 text-center text-xs text-[var(--pa-text-muted)]">
              You&apos;ll earn <span className="font-semibold text-amber-400">{Math.floor(selectedService.priceNum / 10)} points</span> for this visit
            </p>
          </div>

          <button
            onClick={() => setBooked(true)}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#D946EF] py-3 text-sm font-semibold text-white transition hover:bg-[#C026D3]"
          >
            Confirm Booking
            <ChevronRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
