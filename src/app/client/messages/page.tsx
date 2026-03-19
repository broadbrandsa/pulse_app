"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Send01 } from "@untitledui/icons";

/* ── mock data ─────────────────────────────────────────────── */

interface Message {
  id: number;
  sender: "sipho" | "kefilwe" | "system";
  text: string;
  time: string;
}

const messages: Message[] = [
  { id: 1, sender: "sipho", text: "Hey Kefilwe! Welcome to PulseApp. I'm excited to be your trainer. Let's crush some goals together!", time: "9:02 AM" },
  { id: 2, sender: "kefilwe", text: "Hi Sipho! Thanks so much. I'm really motivated to get started.", time: "9:05 AM" },
  { id: 3, sender: "sipho", text: "Great energy! I've put together your first week plan. It focuses on building a solid foundation with compound movements.", time: "9:08 AM" },
  { id: 4, sender: "kefilwe", text: "That sounds perfect. I've been doing mostly cardio on my own so this will be a nice change.", time: "9:12 AM" },
  { id: 5, sender: "sipho", text: "You'll love it. Strength training is a game-changer. Quick question - do you have any injuries or areas I should be aware of?", time: "9:15 AM" },
  { id: 6, sender: "kefilwe", text: "My left knee gets a bit stiff sometimes from an old netball injury. Nothing major but worth knowing.", time: "9:20 AM" },
  { id: 7, sender: "system", text: "Sipho shared a workout plan: Week 1 Foundation", time: "9:25 AM" },
  { id: 8, sender: "sipho", text: "Noted! I've adjusted the plan to include some knee-friendly alternatives. Check the plan I just shared.", time: "9:26 AM" },
  { id: 9, sender: "kefilwe", text: "You're the best! I'll look through it tonight. See you tomorrow morning?", time: "9:30 AM" },
  { id: 10, sender: "sipho", text: "See you at 6:30 AM sharp! Remember to hydrate well tonight and get a good sleep.", time: "9:33 AM" },
  { id: 11, sender: "kefilwe", text: "Will do! I'm actually looking forward to an early morning workout for once haha", time: "9:35 AM" },
  { id: 12, sender: "sipho", text: "That's the spirit! Remember, consistency beats intensity. We've got this. See you tomorrow!", time: "9:38 AM" },
];

const quickReplies = [
  "Thanks!",
  "See you then",
  "On my way \u{1F3C3}",
  "Can we reschedule?",
  "Question about my workout",
];

/* ── component ─────────────────────────────────────────────── */

export default function MessagesPage() {
  const [inputValue, setInputValue] = useState("");
  const [chatMessages, setChatMessages] = useState(messages);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on mount and when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const newMsg: Message = {
      id: chatMessages.length + 1,
      sender: "kefilwe",
      text: inputValue.trim(),
      time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    };
    setChatMessages((prev) => [...prev, newMsg]);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-[calc(100vh-7.5rem)] flex-col">
      {/* ── Header (sticky top) ────────────────────────── */}
      <div className="sticky top-14 z-30 flex items-center gap-3 border-b border-[#262626] bg-[#0D0D0D] px-4 py-3">
        <Link href="/client" className="rounded-lg p-1.5 text-[#A1A1AA] transition hover:bg-[#161616] hover:text-[#FAFAFA]">
          <ArrowLeft className="size-5" />
        </Link>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#5A4EFF]/20 text-xs font-bold text-[#A78BFA]">
          SD
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[#FAFAFA]">Sipho Dlamini</p>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-[#22C55E]" />
            <span className="text-xs text-[#71717A]">Personal Trainer &middot; Online</span>
          </div>
        </div>
      </div>

      {/* ── Message thread (scrollable) ────────────────── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
        {/* Day separator */}
        <div className="mb-4 flex items-center justify-center">
          <span className="rounded-full bg-[#1A1A1A] px-3 py-1 text-[10px] font-medium text-[#71717A]">Today</span>
        </div>

        <div className="space-y-3">
          {chatMessages.map((msg) => {
            if (msg.sender === "system") {
              return (
                <div key={msg.id} className="flex justify-center">
                  <p className="max-w-[280px] rounded-xl bg-[#1A1A1A] px-4 py-2 text-center text-xs text-[#71717A]">
                    {msg.text}
                  </p>
                </div>
              );
            }

            const isSipho = msg.sender === "sipho";

            return (
              <div key={msg.id} className={`flex ${isSipho ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[80%] space-y-1 ${isSipho ? "" : "flex flex-col items-end"}`}>
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      isSipho
                        ? "bg-[#1A1A1A] text-[#E4E4E7]"
                        : "bg-[#5A4EFF] text-white"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-[#52525B]">{msg.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Quick replies ──────────────────────────────── */}
      <div className="-mx-0 flex gap-2 overflow-x-auto border-t border-[#1A1A1A] px-4 py-2">
        {quickReplies.map((qr) => (
          <button
            key={qr}
            onClick={() => setInputValue(qr)}
            className="shrink-0 rounded-full border border-[#262626] bg-[#111111] px-3.5 py-1.5 text-xs font-medium text-[#A1A1AA] transition hover:border-[#5A4EFF] hover:text-[#FAFAFA]"
          >
            {qr}
          </button>
        ))}
      </div>

      {/* ── Input bar (sticky bottom) ──────────────────── */}
      <div className="border-t border-[#1A1A1A] bg-[#0A0A0A] px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="h-12 flex-1 rounded-xl bg-[#111111] px-4 text-sm text-[#FAFAFA] placeholder-[#52525B] outline-none ring-1 ring-[#262626] transition focus:ring-[#5A4EFF]"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#5A4EFF] text-white transition hover:bg-[#4F43E6] disabled:opacity-40"
          >
            <Send01 className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
