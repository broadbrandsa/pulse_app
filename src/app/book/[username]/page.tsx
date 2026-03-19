"use client";

import { useState } from "react";

const SERVICES = [
  { id: "s1", name: "1-on-1 Personal Training", duration: "60 min", price: 650, category: "Training" },
  { id: "s2", name: "Couples Training", duration: "60 min", price: 900, category: "Training" },
  { id: "s3", name: "HIIT Group Session", duration: "45 min", price: 250, category: "Group" },
  { id: "s4", name: "Body Composition Assessment", duration: "30 min", price: 350, category: "Assessment" },
  { id: "s5", name: "Nutrition Consultation", duration: "45 min", price: 500, category: "Nutrition" },
  { id: "s6", name: "Online Coaching Check-in", duration: "30 min", price: 300, category: "Online" },
  { id: "s7", name: "Strength Foundations", duration: "60 min", price: 550, category: "Training" },
  { id: "s8", name: "Mobility & Recovery", duration: "45 min", price: 400, category: "Recovery" },
];

const CATEGORIES = ["All", "Training", "Group", "Assessment", "Nutrition", "Online", "Recovery"];

const TIME_SLOTS = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
  "14:00", "15:00", "16:00", "17:00", "18:00",
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

type Step = "service" | "date" | "details" | "confirm" | "success";

export default function BookingPage() {
  const [step, setStep] = useState<Step>("service");
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps: { key: Step; label: string }[] = [
    { key: "service", label: "Service" },
    { key: "date", label: "Date & Time" },
    { key: "details", label: "Details" },
    { key: "confirm", label: "Confirm" },
  ];

  const service = SERVICES.find((s) => s.id === selectedService);
  const today = new Date();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const filteredServices = categoryFilter === "All" ? SERVICES : SERVICES.filter((s) => s.category === categoryFilter);

  const validateForm = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.phone.trim()) e.phone = "Phone is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === "service" && selectedService) setStep("date");
    else if (step === "date" && selectedDate && selectedTime) setStep("details");
    else if (step === "details" && validateForm()) setStep("confirm");
    else if (step === "confirm") setStep("success");
  };

  const handleBack = () => {
    if (step === "date") setStep("service");
    else if (step === "details") setStep("date");
    else if (step === "confirm") setStep("details");
  };

  const stepIndex = steps.findIndex((s) => s.key === step);

  const generateICS = () => {
    if (!selectedDate || !selectedTime || !service) return;
    const d = new Date(currentYear, currentMonth, selectedDate);
    const [h, m] = selectedTime.split(":").map(Number);
    d.setHours(h, m);
    const pad = (n: number) => n.toString().padStart(2, "0");
    const fmt = (dt: Date) =>
      `${dt.getFullYear()}${pad(dt.getMonth() + 1)}${pad(dt.getDate())}T${pad(dt.getHours())}${pad(dt.getMinutes())}00`;
    const end = new Date(d.getTime() + 60 * 60 * 1000);
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${fmt(d)}\nDTEND:${fmt(end)}\nSUMMARY:${service.name} with Sipho Dlamini\nLOCATION:Cape Town\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "booking.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareWhatsApp = () => {
    if (!service || !selectedDate || !selectedTime) return;
    const dateStr = `${selectedDate} ${MONTHS[currentMonth]} ${currentYear}`;
    const msg = encodeURIComponent(
      `I just booked ${service.name} with Sipho Dlamini on ${dateStr} at ${selectedTime}. Can't wait!`
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  if (step === "success") {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
        <div className="bg-[#111111] border border-[#262626] rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-[#5A4EFF]/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#5A4EFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-[#FAFAFA] mb-2">Booking Confirmed!</h2>
          <p className="text-[#A1A1AA] mb-6">Your session has been booked with Sipho Dlamini.</p>
          <div className="bg-[#0A0A0A] border border-[#262626] rounded-xl p-4 mb-6 text-left space-y-2">
            <div className="flex justify-between"><span className="text-[#71717A]">Service</span><span className="text-[#FAFAFA]">{service?.name}</span></div>
            <div className="flex justify-between"><span className="text-[#71717A]">Date</span><span className="text-[#FAFAFA]">{selectedDate} {MONTHS[currentMonth]} {currentYear}</span></div>
            <div className="flex justify-between"><span className="text-[#71717A]">Time</span><span className="text-[#FAFAFA]">{selectedTime}</span></div>
            <div className="flex justify-between"><span className="text-[#71717A]">Price</span><span className="text-[#E2F4A6] font-semibold">R{service?.price}</span></div>
          </div>
          <div className="flex gap-3">
            <button onClick={generateICS} className="flex-1 min-h-[44px] bg-[#111111] border border-[#262626] text-[#FAFAFA] rounded-xl font-medium hover:bg-[#1a1a1a] transition duration-100 ease-linear">
              Add to Calendar
            </button>
            <button onClick={shareWhatsApp} className="flex-1 min-h-[44px] bg-[#25D366] text-white rounded-xl font-medium hover:bg-[#20bd5a] transition duration-100 ease-linear">
              Share via WhatsApp
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA]">
      {/* Header */}
      <div className="border-b border-[#262626] bg-[#111111]">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#5A4EFF] to-[#EEA0FF] flex items-center justify-center text-white font-bold text-lg">SD</div>
            <div>
              <h1 className="text-xl font-bold">Sipho Dlamini</h1>
              <p className="text-[#A1A1AA] text-sm">Personal Trainer &middot; Cape Town</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-yellow-400 text-sm">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
                <span className="text-[#A1A1AA] text-xs">4.9 (127 reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${
                i < stepIndex ? "bg-[#5A4EFF] text-white" : i === stepIndex ? "bg-[#5A4EFF] text-white" : "bg-[#262626] text-[#71717A]"
              }`}>
                {i < stepIndex ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                ) : i + 1}
              </div>
              <span className={`text-sm hidden sm:block ${i <= stepIndex ? "text-[#FAFAFA]" : "text-[#71717A]"}`}>{s.label}</span>
              {i < steps.length - 1 && <div className={`flex-1 h-px ${i < stepIndex ? "bg-[#5A4EFF]" : "bg-[#262626]"}`} />}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 pb-32">
        {/* Step 1: Service */}
        {step === "service" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Select a Service</h2>
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {CATEGORIES.map((c) => (
                <button key={c} onClick={() => setCategoryFilter(c)} className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition duration-100 ease-linear ${
                  categoryFilter === c ? "bg-[#5A4EFF] text-white" : "bg-[#111111] border border-[#262626] text-[#A1A1AA] hover:text-[#FAFAFA]"
                }`}>{c}</button>
              ))}
            </div>
            <div className="space-y-3">
              {filteredServices.map((s) => (
                <button key={s.id} onClick={() => setSelectedService(s.id)} className={`w-full text-left p-4 rounded-2xl border transition duration-100 ease-linear ${
                  selectedService === s.id ? "bg-[#5A4EFF]/10 border-[#5A4EFF]" : "bg-[#111111] border-[#262626] hover:border-[#5A4EFF]/50"
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-[#FAFAFA]">{s.name}</p>
                      <p className="text-sm text-[#71717A] mt-1">{s.duration} &middot; {s.category}</p>
                    </div>
                    <span className="text-[#E2F4A6] font-semibold">R{s.price}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Date & Time */}
        {step === "date" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Pick a Date & Time</h2>

            {/* Smart Scheduling Suggestions */}
            <div className="mb-4">
              <p className="text-xs font-medium text-[#A1A1AA] mb-2">Suggested times for you</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { day: "Tue", time: "09:00", reason: "your usual time" },
                  { day: "Thu", time: "07:00", reason: "high availability" },
                  { day: "Mon", time: "10:00", reason: "popular slot" },
                ].map((s, i) => {
                  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
                  const targetIdx = days.indexOf(s.day);
                  const todayDate = new Date();
                  const diff = (targetIdx - todayDate.getDay() + 7) % 7 || 7;
                  const nextDate = new Date(todayDate);
                  nextDate.setDate(todayDate.getDate() + diff);
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setCurrentMonth(nextDate.getMonth());
                        setCurrentYear(nextDate.getFullYear());
                        setSelectedDate(nextDate.getDate());
                        setSelectedTime(s.time);
                      }}
                      className="flex items-center gap-2 rounded-xl border border-[#262626] bg-[#111111] px-3 py-2 text-left transition hover:border-[#5A4EFF]"
                    >
                      <span className="text-sm font-medium text-[#FAFAFA]">{s.day} {s.time}</span>
                      <span className="text-[10px] text-[#71717A]">{s.reason}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#111111] border border-[#262626] rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); } else setCurrentMonth(currentMonth - 1); }} className="w-8 h-8 rounded-lg bg-[#262626] flex items-center justify-center text-[#FAFAFA] hover:bg-[#333] transition duration-100 ease-linear">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <span className="font-medium">{MONTHS[currentMonth]} {currentYear}</span>
                <button onClick={() => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); } else setCurrentMonth(currentMonth + 1); }} className="w-8 h-8 rounded-lg bg-[#262626] flex items-center justify-center text-[#FAFAFA] hover:bg-[#333] transition duration-100 ease-linear">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {DAYS.map((d) => <div key={d} className="text-xs text-[#71717A] py-1">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const isPast = currentYear === today.getFullYear() && currentMonth === today.getMonth() && day < today.getDate();
                  const isToday = currentYear === today.getFullYear() && currentMonth === today.getMonth() && day === today.getDate();
                  const isSelected = selectedDate === day;
                  return (
                    <button key={day} disabled={isPast} onClick={() => setSelectedDate(day)} className={`h-10 rounded-lg text-sm font-medium transition duration-100 ease-linear ${
                      isPast ? "text-[#333] cursor-not-allowed" : isSelected ? "bg-[#5A4EFF] text-white" : isToday ? "bg-[#5A4EFF]/20 text-[#5A4EFF]" : "text-[#FAFAFA] hover:bg-[#262626]"
                    }`}>{day}</button>
                  );
                })}
              </div>
            </div>
            {selectedDate && (
              <div>
                <h3 className="text-sm font-medium text-[#A1A1AA] mb-3">Available Times</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {TIME_SLOTS.map((t) => (
                    <button key={t} onClick={() => setSelectedTime(t)} className={`min-h-[44px] rounded-xl text-sm font-medium transition duration-100 ease-linear ${
                      selectedTime === t ? "bg-[#5A4EFF] text-white" : "bg-[#111111] border border-[#262626] text-[#A1A1AA] hover:border-[#5A4EFF]/50 hover:text-[#FAFAFA]"
                    }`}>{t}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Session Location */}
            {service && (
              <div className="mt-3 rounded-lg border border-[#262626] bg-[#111111] p-3">
                <p className="text-xs text-[#A1A1AA]">Session location</p>
                <p className="text-sm font-medium text-[#FAFAFA]">
                  {service.name === "HIIT Group Session" ? "Signal Hill Park, Cape Town" :
                   service.name === "Mobility & Recovery" ? "Your location — please provide address at checkout" :
                   "Home Studio, 24 Kloof Street, Cape Town"}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Details */}
        {step === "details" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Your Details</h2>
            <div className="space-y-4">
              {(["name", "email", "phone"] as const).map((field) => (
                <div key={field}>
                  <label className="block text-sm text-[#A1A1AA] mb-1.5 capitalize">{field === "phone" ? "Phone Number" : field}</label>
                  <input
                    type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                    value={form[field]}
                    onChange={(e) => { setForm({ ...form, [field]: e.target.value }); setErrors({ ...errors, [field]: "" }); }}
                    placeholder={field === "name" ? "John Doe" : field === "email" ? "john@example.com" : "+27 82 123 4567"}
                    className={`w-full min-h-[44px] px-4 bg-[#0A0A0A] border rounded-xl text-[#FAFAFA] placeholder-[#71717A] outline-none focus:border-[#5A4EFF] transition duration-100 ease-linear ${
                      errors[field] ? "border-red-500" : "border-[#262626]"
                    }`}
                  />
                  {errors[field] && <p className="text-red-400 text-xs mt-1">{errors[field]}</p>}
                </div>
              ))}
              <div>
                <label className="block text-sm text-[#A1A1AA] mb-1.5">Notes (optional)</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Any injuries or goals to mention?"
                  rows={3}
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#262626] rounded-xl text-[#FAFAFA] placeholder-[#71717A] outline-none focus:border-[#5A4EFF] transition duration-100 ease-linear resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === "confirm" && service && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Confirm Booking</h2>
            <div className="bg-[#111111] border border-[#262626] rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-[#262626]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5A4EFF] to-[#EEA0FF] flex items-center justify-center text-white font-bold text-sm">SD</div>
                <div>
                  <p className="font-medium text-[#FAFAFA]">Sipho Dlamini</p>
                  <p className="text-sm text-[#71717A]">Cape Town</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-[#71717A]">Service</span><span className="text-[#FAFAFA]">{service.name}</span></div>
                <div className="flex justify-between"><span className="text-[#71717A]">Duration</span><span className="text-[#FAFAFA]">{service.duration}</span></div>
                <div className="flex justify-between"><span className="text-[#71717A]">Date</span><span className="text-[#FAFAFA]">{selectedDate} {MONTHS[currentMonth]} {currentYear}</span></div>
                <div className="flex justify-between"><span className="text-[#71717A]">Time</span><span className="text-[#FAFAFA]">{selectedTime}</span></div>
                <div className="flex justify-between"><span className="text-[#71717A]">Client</span><span className="text-[#FAFAFA]">{form.name}</span></div>
                <div className="flex justify-between"><span className="text-[#71717A]">Email</span><span className="text-[#FAFAFA]">{form.email}</span></div>
              </div>
              <div className="pt-4 border-t border-[#262626] flex justify-between">
                <span className="text-[#A1A1AA] font-medium">Total</span>
                <span className="text-[#E2F4A6] text-xl font-bold">R{service.price}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#111111] border-t border-[#262626] p-4">
          <div className="max-w-2xl mx-auto flex gap-3">
            {step !== "service" && (
              <button onClick={handleBack} className="min-h-[44px] px-6 bg-[#111111] border border-[#262626] text-[#FAFAFA] rounded-xl font-medium hover:bg-[#1a1a1a] transition duration-100 ease-linear">
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={
                (step === "service" && !selectedService) ||
                (step === "date" && (!selectedDate || !selectedTime))
              }
              className="flex-1 min-h-[44px] bg-[#5A4EFF] text-white rounded-xl font-medium hover:bg-[#4840E8] disabled:opacity-40 disabled:cursor-not-allowed transition duration-100 ease-linear"
            >
              {step === "confirm" ? "Confirm Booking" : "Continue"}
            </button>
          </div>
        </div>
    </div>
  );
}