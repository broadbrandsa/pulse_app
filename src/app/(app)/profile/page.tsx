"use client";

import { useState } from "react";
import { business, services } from "@/lib/mock-data";
import { StatusBadge } from "@/components/ui/status-badge";
import { Edit01, Mail01, Phone01, Star01, Check, X } from "@untitledui/icons";
import { formatCurrency } from "@/lib/utils";

const specialities = ["Functional Fitness", "Boxing", "HIIT", "Yoga", "Nutrition", "Rehab"];
const certifications = ["HFPA Personal Training Certification", "Boxing SA Conditioning Coach", "First Aid Level 3", "Sports Nutrition Diploma"];
const contactDetails = [
    { label: "Email", value: "sipho@pulseapp.co.za", icon: Mail01 },
    { label: "Phone", value: "+27 82 345 6789", icon: Phone01 },
    { label: "Instagram", value: "@sipho_pt", icon: null },
    { label: "WhatsApp Business", value: "+27 82 345 6789", icon: null },
];

const reviews = [
    { name: "Annelize van Wyk", initials: "AW", rating: 5, text: "Sipho completely transformed my fitness journey. His personalised approach and constant motivation kept me going. Down 8kg in 3 months!", date: "2 weeks ago", response: "Thank you Annelize! Your dedication has been incredible." },
    { name: "Sihle Ndaba", initials: "SN", rating: 5, text: "Best PT in Cape Town. My boxing conditioning has improved massively. Sipho really knows his stuff.", date: "1 month ago" },
    { name: "Nadine Petersen", initials: "NP", rating: 4, text: "Very professional and knowledgeable. The nutrition guidance alongside training made a huge difference.", date: "6 weeks ago" },
    { name: "Precious Dube", initials: "PD", rating: 5, text: "I was nervous to start training but Sipho made me feel so comfortable. Amazing progress tracking.", date: "2 months ago" },
    { name: "Craig Williams", initials: "CW", rating: 5, text: "Incredible experience. The online booking makes it so easy to manage sessions around my work schedule.", date: "2 months ago", response: "Thanks Craig! Two Oceans is going to be a breeze for you!" },
];

const starDistribution = [
    { stars: 5, count: 41 },
    { stars: 4, count: 5 },
    { stars: 3, count: 1 },
    { stars: 2, count: 0 },
    { stars: 1, count: 0 },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-150 ${checked ? "bg-[#5A4EFF]" : "bg-[#333333]"}`}
        >
            <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform duration-150 ${checked ? "translate-x-6" : "translate-x-1"}`} />
        </button>
    );
}

export default function ProfilePage() {
    const [reminders, setReminders] = useState({
        session24h: true, session2h: true, intakeForm: true, rebookingNudge: true,
        birthday: true, membershipExpiry: true, reviewRequest: false,
    });
    const [enforceCancellation, setEnforceCancellation] = useState(true);
    const [showReviewModal, setShowReviewModal] = useState(false);

    const reminderItems = [
        { key: "session24h" as const, label: "Session reminder (24h)", desc: "Send WhatsApp reminder 24 hours before" },
        { key: "session2h" as const, label: "Session reminder (2h)", desc: "Send WhatsApp reminder 2 hours before" },
        { key: "intakeForm" as const, label: "Intake form", desc: "Send intake form to new clients automatically" },
        { key: "rebookingNudge" as const, label: "Rebooking nudge", desc: "Remind clients who haven't booked in 4 weeks" },
        { key: "birthday" as const, label: "Birthday message", desc: "Send birthday message with discount offer" },
        { key: "membershipExpiry" as const, label: "Membership expiry", desc: "Alert clients 7 days before membership expires" },
        { key: "reviewRequest" as const, label: "Review request", desc: "Request review 24 hours after session" },
    ];

    return (
        <div className="min-h-screen pb-8">
            <div className="px-4 pt-6 lg:px-6">
                <div className="lg:grid lg:grid-cols-3 lg:gap-6">
                    {/* Left column */}
                    <div className="lg:col-span-1">
                        <div className="relative rounded-2xl border border-[#262626] bg-[#111111] p-4 lg:p-6">
                            <button className="absolute right-4 top-4 rounded-lg p-2 text-[#71717A] transition duration-100 ease-linear hover:bg-[#1A1A1A] hover:text-[#FAFAFA]">
                                <Edit01 className="size-5" />
                            </button>
                            <div className="flex flex-col items-center text-center">
                                <div className="flex size-20 items-center justify-center rounded-full bg-[#5A4EFF]/10 text-2xl font-semibold text-[#5A4EFF]">SD</div>
                                <h1 className="mt-3 text-xl font-semibold text-[#FAFAFA]">Sipho Dlamini</h1>
                                <p className="mt-0.5 text-sm text-[#A1A1AA]">Personal Trainer</p>
                                <p className="mt-0.5 text-xs text-[#71717A]">Cape Town, South Africa</p>
                                <div className="mt-2 flex items-center gap-1">
                                    <Star01 className="size-4 text-[#F59E0B]" />
                                    <span className="text-sm font-medium text-[#FAFAFA]">4.9</span>
                                    <span className="text-xs text-[#71717A]">(47 reviews)</span>
                                </div>
                            </div>
                            <div className="mt-5 rounded-xl bg-[#1A1A1A] p-3">
                                <p className="text-sm leading-relaxed text-[#A1A1AA]">
                                    Certified personal trainer with 8 years experience specialising in functional fitness, boxing conditioning, and body transformation. HFPA registered.
                                </p>
                            </div>
                            <div className="mt-5">
                                <h3 className="text-xs font-medium uppercase tracking-wider text-[#71717A]">Specialities</h3>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {specialities.map((s) => (
                                        <span key={s} className="whitespace-nowrap rounded-full bg-[#5A4EFF]/10 px-3 py-1 text-xs font-medium text-[#5A4EFF]">{s}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 rounded-2xl border border-[#262626] bg-[#111111] p-4 lg:p-6">
                            <h3 className="text-xs font-medium uppercase tracking-wider text-[#71717A]">Contact &amp; Social</h3>
                            <div className="mt-3 space-y-3">
                                {contactDetails.map((item) => (
                                    <div key={item.label} className="flex items-center gap-3">
                                        {item.icon ? <item.icon className="size-4 shrink-0 text-[#71717A]" /> : <span className="flex size-4 shrink-0 items-center justify-center text-xs text-[#71717A]">@</span>}
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-[#71717A]">{item.label}</p>
                                            <p className="truncate text-sm text-[#FAFAFA]">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right column */}
                    <div className="mt-4 space-y-4 lg:col-span-2 lg:mt-0">
                        {/* Certifications */}
                        <div className="rounded-2xl border border-[#262626] bg-[#111111] p-4 lg:p-6">
                            <h3 className="text-xs font-medium uppercase tracking-wider text-[#71717A]">Certifications</h3>
                            <ul className="mt-3 space-y-2.5">
                                {certifications.map((cert) => (
                                    <li key={cert} className="flex items-center gap-2.5">
                                        <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#E2F4A6]/10"><Check className="size-3.5 text-[#E2F4A6]" /></div>
                                        <span className="text-sm text-[#FAFAFA]">{cert}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Services & Pricing */}
                        <div className="rounded-2xl border border-[#262626] bg-[#111111] p-4 lg:p-6">
                            <h3 className="text-xs font-medium uppercase tracking-wider text-[#71717A]">Services &amp; Pricing</h3>
                            <div className="mt-3 divide-y divide-[#1A1A1A]">
                                {services.map((service) => (
                                    <div key={service.name} className="flex min-h-[44px] items-center justify-between py-3 first:pt-0 last:pb-0">
                                        <span className="text-sm text-[#FAFAFA]">{service.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-[#FAFAFA]">{formatCurrency(service.price)}</span>
                                            <button className="rounded-lg p-1.5 text-[#71717A] transition hover:bg-[#1A1A1A] hover:text-[#FAFAFA]"><Edit01 className="size-4" /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reviews & Reputation */}
                        <div className="rounded-2xl border border-[#262626] bg-[#111111] p-4 lg:p-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-medium uppercase tracking-wider text-[#71717A]">Reviews &amp; Reputation</h3>
                                <button onClick={() => setShowReviewModal(true)} className="text-xs font-medium text-[#5A4EFF] hover:text-[#4840E8]">Request review</button>
                            </div>
                            {/* Summary */}
                            <div className="mt-4 flex flex-col items-center gap-4 lg:flex-row">
                                <div className="text-center">
                                    <p className="text-4xl font-bold text-[#FAFAFA]">4.9</p>
                                    <div className="mt-1 flex gap-0.5">{[1,2,3,4,5].map(i => <Star01 key={i} className="size-4 text-[#F59E0B]" />)}</div>
                                    <p className="mt-1 text-xs text-[#71717A]">47 reviews</p>
                                </div>
                                <div className="flex-1 space-y-1.5">
                                    {starDistribution.map(d => (
                                        <div key={d.stars} className="flex items-center gap-2">
                                            <span className="w-6 text-right text-xs text-[#71717A]">{d.stars}★</span>
                                            <div className="h-2 flex-1 rounded-full bg-[#1A1A1A]">
                                                <div className="h-full rounded-full bg-[#5A4EFF]" style={{ width: `${(d.count / 47) * 100}%` }} />
                                            </div>
                                            <span className="w-6 text-xs text-[#71717A]">{d.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Reviews */}
                            <div className="mt-6 space-y-4">
                                {reviews.map((r, i) => (
                                    <div key={i} className="rounded-xl border border-[#1A1A1A] bg-[#0A0A0A] p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5A4EFF]/10 text-xs font-semibold text-[#5A4EFF]">{r.initials}</div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-[#FAFAFA]">{r.name}</p>
                                                <div className="flex items-center gap-1">
                                                    {Array.from({ length: r.rating }).map((_, j) => <Star01 key={j} className="size-3 text-[#F59E0B]" />)}
                                                    <span className="ml-2 text-xs text-[#71717A]">{r.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="mt-2 text-sm text-[#A1A1AA]">{r.text}</p>
                                        {r.response && (
                                            <div className="mt-3 rounded-lg bg-[#1A1A1A] p-3">
                                                <p className="text-xs font-medium text-[#71717A]">Sipho replied:</p>
                                                <p className="mt-1 text-sm text-[#A1A1AA]">{r.response}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Cancellation Policy */}
                        <div className="rounded-2xl border border-[#262626] bg-[#111111] p-4 lg:p-6">
                            <h3 className="text-xs font-medium uppercase tracking-wider text-[#71717A]">Cancellation Policy</h3>
                            <div className="mt-4 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-[#FAFAFA]">Enforce cancellation policy</p>
                                    <p className="text-xs text-[#71717A]">Charge clients for late cancellations</p>
                                </div>
                                <Toggle checked={enforceCancellation} onChange={setEnforceCancellation} />
                            </div>
                            {enforceCancellation && (
                                <div className="mt-4 rounded-xl bg-[#1A1A1A] p-3">
                                    <p className="text-sm text-[#A1A1AA]">Cancellations within <span className="font-semibold text-[#FAFAFA]">24 hours</span> are charged <span className="font-semibold text-[#FAFAFA]">50%</span> of the session fee.</p>
                                </div>
                            )}
                        </div>

                        {/* Automated Reminders */}
                        <div className="rounded-2xl border border-[#262626] bg-[#111111] p-4 lg:p-6">
                            <h3 className="text-xs font-medium uppercase tracking-wider text-[#71717A]">Automated Reminders</h3>
                            <div className="mt-4 space-y-4">
                                {reminderItems.map((item) => (
                                    <div key={item.key} className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-[#FAFAFA]">{item.label}</p>
                                            <p className="text-xs text-[#71717A]">{item.desc}</p>
                                        </div>
                                        <Toggle
                                            checked={reminders[item.key]}
                                            onChange={(v) => setReminders(prev => ({ ...prev, [item.key]: v }))}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Business Details */}
                        <div className="rounded-2xl border border-[#262626] bg-[#111111] p-4 lg:p-6">
                            <h3 className="text-xs font-medium uppercase tracking-wider text-[#71717A]">Business Details</h3>
                            <div className="mt-3 space-y-3">
                                <div className="flex items-center justify-between"><span className="text-sm text-[#71717A]">Business Name</span><span className="text-sm font-medium text-[#FAFAFA]">{business.name}</span></div>
                                <div className="flex items-center justify-between"><span className="text-sm text-[#71717A]">Location</span><span className="text-sm font-medium text-[#FAFAFA]">{business.location}</span></div>
                                <div className="flex items-center justify-between"><span className="text-sm text-[#71717A]">Plan</span><StatusBadge variant="violet">{business.plan}</StatusBadge></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Review Request Modal */}
            {showReviewModal && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowReviewModal(false)}>
                    <div className="mx-4 w-full max-w-md rounded-2xl border border-[#262626] bg-[#111111] p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-[#FAFAFA]">Send Review Request</h2>
                            <button onClick={() => setShowReviewModal(false)} className="rounded-lg p-1 text-[#71717A]"><X className="size-5" /></button>
                        </div>
                        <div className="mt-4 rounded-xl bg-[#1A1A1A] p-3">
                            <p className="text-sm text-[#A1A1AA]">Hi [Client], it was great training with you! Could you leave a quick review? It really helps grow my business. Thank you!</p>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <button className="flex-1 rounded-xl bg-[#5A4EFF] py-3 text-sm font-medium text-white hover:bg-[#4840E8]">Send via WhatsApp</button>
                            <button className="flex-1 rounded-xl border border-[#262626] py-3 text-sm font-medium text-[#FAFAFA] hover:bg-[#1A1A1A]">Send via Email</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
