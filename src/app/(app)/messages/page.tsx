"use client";

import { useState, useRef, useEffect } from "react";

type Message = { id: string; text: string; sender: "me" | "them"; time: string };
type Conversation = {
  id: string; name: string; avatar: string; lastMessage: string; time: string;
  unread: number; online: boolean; messages: Message[];
};

type BroadcastStatus = "Sent" | "Scheduled" | "Draft";
type Channel = "WhatsApp" | "Email" | "SMS";
type Segment = "All Clients" | "Active Members" | "Gold Members" | "Expiring Within 30 Days" | "Inactive 30+ Days" | "New This Month";

type Broadcast = {
  id: string;
  title: string;
  audience: Segment;
  channels: Channel[];
  date: string;
  sent?: number;
  delivered?: number;
  opened?: number;
  status: BroadcastStatus;
};

const SEGMENT_REACH: Record<Segment, number> = {
  "All Clients": 47,
  "Active Members": 38,
  "Gold Members": 18,
  "Expiring Within 30 Days": 12,
  "Inactive 30+ Days": 9,
  "New This Month": 5,
};

const TEMPLATE_BODIES: Record<string, string> = {
  "Renewal Reminder": "Hi! Your membership is expiring soon. Renew now to keep your progress going and enjoy uninterrupted access to all sessions. Reply to this message or visit us to renew today!",
  "Welcome Back": "Welcome back! We've missed you. We have new classes and updated schedules ready for you. Let's pick up where we left off -- book your next session today!",
  "Promotion": "Exclusive offer just for you! Enjoy 20% off any package this month. Use code PULSE20 when booking. Limited spots available -- don't miss out!",
  "Schedule Update": "Important schedule update: Please note our updated session times effective this week. Check your app for the latest availability and book your preferred slot.",
};

const INITIAL_BROADCASTS: Broadcast[] = [
  { id: "b1", title: "January Welcome Back", audience: "All Clients", channels: ["WhatsApp", "Email"], date: "Jan 2", sent: 47, delivered: 45, opened: 31, status: "Sent" },
  { id: "b2", title: "Membership Renewal Reminder", audience: "Expiring Within 30 Days", channels: ["Email"], date: "Jan 15", sent: 12, delivered: 12, opened: 9, status: "Sent" },
  { id: "b3", title: "New Year Special — 20% Off Packages", audience: "Active Members", channels: ["WhatsApp"], date: "Jan 10", sent: 47, delivered: 44, status: "Sent" },
  { id: "b4", title: "February Schedule Change", audience: "All Clients", channels: ["Email"], date: "Feb 1 9:00am", status: "Scheduled" },
  { id: "b5", title: "Gold Tier Exclusive: Free Assessment", audience: "Gold Members", channels: ["WhatsApp", "Email", "SMS"], date: "Dec 20", sent: 18, delivered: 17, opened: 14, status: "Sent" },
];

const CONVERSATIONS: Conversation[] = [
  {
    id: "c1", name: "Thando Nkosi", avatar: "TN", lastMessage: "See you tomorrow at 7am!", time: "2m",
    unread: 2, online: true, messages: [
      { id: "m1", text: "Hey Sipho, I wanted to check if our session is still on for tomorrow?", sender: "them", time: "10:30" },
      { id: "m2", text: "Yes! 7am at the studio. Don't forget your resistance bands.", sender: "me", time: "10:32" },
      { id: "m3", text: "Perfect, I'll be there. Should I eat before?", sender: "them", time: "10:33" },
      { id: "m4", text: "Have a light snack about 30 min before. Nothing heavy.", sender: "me", time: "10:35" },
      { id: "m5", text: "See you tomorrow at 7am!", sender: "them", time: "10:36" },
    ],
  },
  {
    id: "c2", name: "Lerato Mokoena", avatar: "LM", lastMessage: "My knee feels much better now", time: "1h",
    unread: 0, online: true, messages: [
      { id: "m1", text: "How's the knee feeling after our modified session?", sender: "me", time: "09:00" },
      { id: "m2", text: "Much better! The ice helped a lot.", sender: "them", time: "09:15" },
      { id: "m3", text: "My knee feels much better now", sender: "them", time: "09:16" },
    ],
  },
  {
    id: "c3", name: "James van der Merwe", avatar: "JM", lastMessage: "Can we reschedule Friday?", time: "3h",
    unread: 1, online: false, messages: [
      { id: "m1", text: "Hey, something came up at work. Can we reschedule Friday?", sender: "them", time: "07:30" },
      { id: "m2", text: "No problem! How about Saturday 9am?", sender: "me", time: "07:45" },
      { id: "m3", text: "Can we reschedule Friday?", sender: "them", time: "08:00" },
    ],
  },
  {
    id: "c4", name: "Naledi Phiri", avatar: "NP", lastMessage: "Thanks for the meal plan!", time: "5h",
    unread: 0, online: false, messages: [
      { id: "m1", text: "I've updated your meal plan for the week. Check the nutrition tab.", sender: "me", time: "06:00" },
      { id: "m2", text: "Thanks for the meal plan!", sender: "them", time: "06:30" },
    ],
  },
  {
    id: "c5", name: "Ryan Govender", avatar: "RG", lastMessage: "Just hit a new PR! 140kg deadlift", time: "1d",
    unread: 0, online: true, messages: [
      { id: "m1", text: "Just hit a new PR! 140kg deadlift", sender: "them", time: "Yesterday" },
      { id: "m2", text: "That's incredible! All that work is paying off.", sender: "me", time: "Yesterday" },
    ],
  },
  {
    id: "c6", name: "Aisha Patel", avatar: "AP", lastMessage: "Payment sent for this month", time: "1d",
    unread: 0, online: false, messages: [
      { id: "m1", text: "Payment sent for this month", sender: "them", time: "Yesterday" },
      { id: "m2", text: "Received, thank you Aisha!", sender: "me", time: "Yesterday" },
    ],
  },
  {
    id: "c7", name: "Bongani Zulu", avatar: "BZ", lastMessage: "How many sets for the squats?", time: "2d",
    unread: 0, online: false, messages: [
      { id: "m1", text: "How many sets for the squats?", sender: "them", time: "2 days ago" },
      { id: "m2", text: "4 sets of 8 reps. Rest 90 seconds between sets.", sender: "me", time: "2 days ago" },
    ],
  },
  {
    id: "c8", name: "Chloe Botha", avatar: "CB", lastMessage: "I'll bring a friend to the group class", time: "3d",
    unread: 0, online: false, messages: [
      { id: "m1", text: "I'll bring a friend to the group class", sender: "them", time: "3 days ago" },
      { id: "m2", text: "Great! First session is free for referrals.", sender: "me", time: "3 days ago" },
    ],
  },
];

const QUICK_REPLIES = [
  "See you at the session!",
  "Great progress, keep it up!",
  "Let me check my schedule.",
  "Don't forget to stay hydrated!",
  "I'll send your updated plan shortly.",
  "Session confirmed!",
];

const SEGMENTS: Segment[] = ["All Clients", "Active Members", "Gold Members", "Expiring Within 30 Days", "Inactive 30+ Days", "New This Month"];
const ALL_CHANNELS: Channel[] = ["WhatsApp", "Email", "SMS"];

function ChannelLabel({ channel }: { channel: Channel }) {
  const colors: Record<Channel, string> = {
    WhatsApp: "bg-[#25D366]",
    Email: "bg-[#3B82F6]",
    SMS: "bg-[#F59E0B]",
  };
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-[#A1A1AA]">
      <span className={`w-2 h-2 rounded-full ${colors[channel]}`} />
      {channel}
    </span>
  );
}

function StatusBadge({ status }: { status: BroadcastStatus }) {
  const map: Record<BroadcastStatus, { bg: string; text: string }> = {
    Sent: { bg: "bg-[#84cc16]/15", text: "text-[#84cc16]" },
    Scheduled: { bg: "bg-[#5A4EFF]/15", text: "text-[#5A4EFF]" },
    Draft: { bg: "bg-[#A1A1AA]/15", text: "text-[#A1A1AA]" },
  };
  const s = map[status];
  return <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>{status}</span>;
}

export default function MessagesPage() {
  // View toggle
  const [view, setView] = useState<"dm" | "broadcasts">("dm");

  // DM state (existing)
  const [conversations, setConversations] = useState(CONVERSATIONS);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Broadcast state
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>(INITIAL_BROADCASTS);
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState<1 | 2 | 3>(1);

  // Modal form state
  const [formSegment, setFormSegment] = useState<Segment>("All Clients");
  const [formChannels, setFormChannels] = useState<Channel[]>(["WhatsApp"]);
  const [formSubject, setFormSubject] = useState("");
  const [formBody, setFormBody] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formScheduleMode, setFormScheduleMode] = useState<"now" | "schedule">("now");
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("");

  // Validation errors
  const [stepErrors, setStepErrors] = useState<string[]>([]);

  const active = conversations.find((c) => c.id === activeId);
  const filtered = conversations.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [active?.messages.length]);

  const sendMessage = (text: string) => {
    if (!text.trim() || !activeId) return;
    const msg: Message = { id: `m-${Date.now()}`, text: text.trim(), sender: "me", time: "Now" };
    setConversations((prev) =>
      prev.map((c) => c.id === activeId ? { ...c, messages: [...c.messages, msg], lastMessage: text.trim(), time: "Now" } : c)
    );
    setInput("");
    setShowQuickReplies(false);
  };

  const openConversation = (id: string) => {
    setActiveId(id);
    setMobileShowChat(true);
    setConversations((prev) => prev.map((c) => c.id === id ? { ...c, unread: 0 } : c));
  };

  const resetModalForm = () => {
    setModalStep(1);
    setFormSegment("All Clients");
    setFormChannels(["WhatsApp"]);
    setFormSubject("");
    setFormBody("");
    setFormTitle("");
    setFormScheduleMode("now");
    setFormDate("");
    setFormTime("");
    setStepErrors([]);
  };

  const openNewBroadcast = () => {
    resetModalForm();
    setShowModal(true);
  };

  const toggleChannel = (ch: Channel) => {
    setFormChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]
    );
  };

  const validateStep = (step: 1 | 2 | 3): boolean => {
    const errors: string[] = [];
    if (step === 1) {
      // segment always has a value
    }
    if (step === 2) {
      if (formChannels.length === 0) errors.push("Select at least one channel.");
      if (formChannels.includes("Email") && !formSubject.trim()) errors.push("Subject line is required for Email.");
      if (!formBody.trim()) errors.push("Message body is required.");
    }
    if (step === 3) {
      if (!formTitle.trim()) errors.push("Broadcast title is required.");
      if (formScheduleMode === "schedule") {
        if (!formDate) errors.push("Schedule date is required.");
        if (!formTime) errors.push("Schedule time is required.");
      }
    }
    setStepErrors(errors);
    return errors.length === 0;
  };

  const handleNext = () => {
    if (!validateStep(modalStep)) return;
    if (modalStep < 3) setModalStep((modalStep + 1) as 1 | 2 | 3);
  };

  const handleBack = () => {
    setStepErrors([]);
    if (modalStep > 1) setModalStep((modalStep - 1) as 1 | 2 | 3);
  };

  const handleSendBroadcast = () => {
    if (!validateStep(3)) return;
    const now = new Date();
    const dateStr = formScheduleMode === "now"
      ? `${now.toLocaleString("en-US", { month: "short" })} ${now.getDate()}`
      : `${formDate} ${formTime}`;
    const reach = SEGMENT_REACH[formSegment];
    const newBroadcast: Broadcast = {
      id: `b-${Date.now()}`,
      title: formTitle.trim(),
      audience: formSegment,
      channels: [...formChannels],
      date: dateStr,
      sent: formScheduleMode === "now" ? reach : undefined,
      delivered: formScheduleMode === "now" ? Math.max(1, reach - Math.floor(Math.random() * 3)) : undefined,
      opened: formScheduleMode === "now" ? Math.max(1, Math.floor(reach * 0.65)) : undefined,
      status: formScheduleMode === "now" ? "Sent" : "Scheduled",
    };
    setBroadcasts((prev) => [newBroadcast, ...prev]);
    setShowModal(false);
    resetModalForm();
  };

  const duplicateBroadcast = (b: Broadcast) => {
    resetModalForm();
    setFormSegment(b.audience);
    setFormChannels([...b.channels]);
    setFormTitle(`${b.title} (Copy)`);
    setShowModal(true);
  };

  // ─── Conversation List (existing) ───
  const ConversationList = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-[#262626]">
        <h1 className="text-xl font-bold text-[#FAFAFA] mb-3">Messages</h1>
        <div className="relative">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search conversations..." className="w-full min-h-[44px] pl-10 pr-4 bg-[#0A0A0A] border border-[#262626] rounded-xl text-[#FAFAFA] placeholder-[#71717A] text-sm outline-none focus:border-[#5A4EFF] transition duration-100 ease-linear" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filtered.map((c) => (
          <button key={c.id} onClick={() => openConversation(c.id)} className={`w-full flex items-center gap-3 p-4 text-left hover:bg-[#1a1a1a] transition duration-100 ease-linear ${
            activeId === c.id ? "bg-[#5A4EFF]/10" : ""
          }`}>
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5A4EFF] to-[#EEA0FF] flex items-center justify-center text-white text-sm font-medium">{c.avatar}</div>
              {c.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#22c55e] border-2 border-[#111111]" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <span className="font-medium text-[#FAFAFA] text-sm truncate">{c.name}</span>
                <span className="text-xs text-[#71717A] shrink-0 ml-2">{c.time}</span>
              </div>
              <p className="text-sm text-[#71717A] truncate">{c.lastMessage}</p>
            </div>
            {c.unread > 0 && <div className="w-5 h-5 rounded-full bg-[#5A4EFF] text-white text-xs flex items-center justify-center shrink-0">{c.unread}</div>}
          </button>
        ))}
      </div>
    </div>
  );

  // ─── Chat Panel (existing) ───
  const ChatPanel = () => {
    if (!active) return (
      <div className="hidden lg:flex flex-1 items-center justify-center text-[#71717A]">
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto mb-3 text-[#262626]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          <p>Select a conversation to start messaging</p>
        </div>
      </div>
    );

    return (
      <div className="flex flex-col h-full flex-1">
        {/* Chat Header */}
        <div className="flex items-center gap-3 p-4 border-b border-[#262626]">
          <button onClick={() => setMobileShowChat(false)} className="lg:hidden w-8 h-8 flex items-center justify-center text-[#A1A1AA]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#5A4EFF] to-[#EEA0FF] flex items-center justify-center text-white text-sm font-medium">{active.avatar}</div>
            {active.online && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#22c55e] border-2 border-[#111111]" />}
          </div>
          <div>
            <p className="font-medium text-[#FAFAFA] text-sm">{active.name}</p>
            <p className="text-xs text-[#71717A]">{active.online ? "Online" : "Offline"}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {active.messages.map((m) => (
            <div key={m.id} className={`flex ${m.sender === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                m.sender === "me" ? "bg-[#5A4EFF] text-white rounded-br-md" : "bg-[#1a1a1a] text-[#FAFAFA] rounded-bl-md"
              }`}>
                <p>{m.text}</p>
                <p className={`text-[10px] mt-1 ${m.sender === "me" ? "text-white/60" : "text-[#71717A]"}`}>{m.time}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        {showQuickReplies && (
          <div className="px-4 pb-2">
            <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-2 space-y-1">
              {QUICK_REPLIES.map((qr) => (
                <button key={qr} onClick={() => sendMessage(qr)} className="w-full text-left px-3 py-2 text-sm text-[#A1A1AA] rounded-lg hover:bg-[#262626] hover:text-[#FAFAFA] transition duration-100 ease-linear">{qr}</button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-[#262626]">
          <div className="flex items-center gap-2">
            <button onClick={() => setShowQuickReplies(!showQuickReplies)} className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition duration-100 ease-linear ${
              showQuickReplies ? "bg-[#5A4EFF] text-white" : "bg-[#1a1a1a] text-[#71717A] hover:text-[#FAFAFA]"
            }`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </button>
            <input
              value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              placeholder="Type a message..."
              className="flex-1 min-h-[44px] px-4 bg-[#0A0A0A] border border-[#262626] rounded-xl text-[#FAFAFA] placeholder-[#71717A] text-sm outline-none focus:border-[#5A4EFF] transition duration-100 ease-linear"
            />
            <button onClick={() => sendMessage(input)} disabled={!input.trim()} className="w-10 h-10 shrink-0 bg-[#5A4EFF] rounded-xl flex items-center justify-center text-white hover:bg-[#4840E8] disabled:opacity-40 transition duration-100 ease-linear">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ─── Broadcasts View ───
  const BroadcastsView = () => (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#262626]">
        <div>
          <h1 className="text-xl font-bold text-[#FAFAFA]">Broadcasts</h1>
          <p className="text-sm text-[#71717A] mt-0.5">{broadcasts.length} broadcast{broadcasts.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={openNewBroadcast} className="flex items-center gap-2 px-4 py-2.5 bg-[#5A4EFF] text-white rounded-xl text-sm font-medium hover:bg-[#4840E8] transition duration-100 ease-linear">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          New Broadcast
        </button>
      </div>

      {/* Broadcast Cards */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {broadcasts.map((b) => (
          <div key={b.id} className="bg-[#111111] border border-[#262626] rounded-xl p-4 hover:border-[#3f3f46] transition duration-100 ease-linear">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="text-[#FAFAFA] font-medium text-sm truncate">{b.title}</h3>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="inline-flex px-2 py-0.5 rounded-md bg-[#262626] text-[#A1A1AA] text-xs">{b.audience}</span>
                  {b.channels.map((ch) => <ChannelLabel key={ch} channel={ch} />)}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <StatusBadge status={b.status} />
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#262626]">
              <div className="flex items-center gap-4 text-xs text-[#71717A]">
                <span>{b.date}</span>
                {b.sent != null && <span>{b.sent} sent</span>}
                {b.delivered != null && <span>{b.delivered} delivered</span>}
                {b.opened != null && <span>{b.opened} opened</span>}
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-xs text-[#A1A1AA] hover:text-[#FAFAFA] bg-[#1a1a1a] rounded-lg hover:bg-[#262626] transition duration-100 ease-linear">View</button>
                <button onClick={() => duplicateBroadcast(b)} className="px-3 py-1.5 text-xs text-[#A1A1AA] hover:text-[#FAFAFA] bg-[#1a1a1a] rounded-lg hover:bg-[#262626] transition duration-100 ease-linear">Duplicate</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ─── New Broadcast Modal ───
  const BroadcastModal = () => {
    if (!showModal) return null;

    const stepTitles = ["Select Audience", "Compose Message", "Review & Schedule"];

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" onClick={() => { setShowModal(false); resetModalForm(); }} />

        {/* Modal */}
        <div className="relative w-full max-w-2xl bg-[#111111] border border-[#262626] rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-5 border-b border-[#262626]">
            <div>
              <h2 className="text-lg font-bold text-[#FAFAFA]">New Broadcast</h2>
              <p className="text-sm text-[#71717A] mt-0.5">Step {modalStep} of 3 — {stepTitles[modalStep - 1]}</p>
            </div>
            <button onClick={() => { setShowModal(false); resetModalForm(); }} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#71717A] hover:text-[#FAFAFA] hover:bg-[#262626] transition duration-100 ease-linear">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Step indicator */}
          <div className="flex gap-1.5 px-5 pt-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`h-1 flex-1 rounded-full transition duration-100 ease-linear ${s <= modalStep ? "bg-[#5A4EFF]" : "bg-[#262626]"}`} />
            ))}
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-5">
            {/* Errors */}
            {stepErrors.length > 0 && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                {stepErrors.map((e, i) => <p key={i} className="text-sm text-red-400">{e}</p>)}
              </div>
            )}

            {/* Step 1: Audience */}
            {modalStep === 1 && (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-[#FAFAFA]">Audience Segment</label>
                <select
                  value={formSegment}
                  onChange={(e) => setFormSegment(e.target.value as Segment)}
                  className="w-full min-h-[44px] px-4 bg-[#0A0A0A] border border-[#262626] rounded-xl text-[#FAFAFA] text-sm outline-none focus:border-[#5A4EFF] transition duration-100 ease-linear appearance-none cursor-pointer"
                >
                  {SEGMENTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <p className="text-sm text-[#71717A]">Estimated reach: <span className="text-[#FAFAFA] font-medium">~{SEGMENT_REACH[formSegment]} clients</span></p>
              </div>
            )}

            {/* Step 2: Content */}
            {modalStep === 2 && (
              <div className="space-y-5">
                {/* Channel toggles */}
                <div>
                  <label className="block text-sm font-medium text-[#FAFAFA] mb-2">Channels</label>
                  <div className="flex gap-2">
                    {ALL_CHANNELS.map((ch) => {
                      const isActive = formChannels.includes(ch);
                      const activeColors: Record<Channel, string> = {
                        WhatsApp: "bg-[#25D366]/15 border-[#25D366] text-[#25D366]",
                        Email: "bg-[#3B82F6]/15 border-[#3B82F6] text-[#3B82F6]",
                        SMS: "bg-[#F59E0B]/15 border-[#F59E0B] text-[#F59E0B]",
                      };
                      return (
                        <button
                          key={ch}
                          onClick={() => toggleChannel(ch)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium border transition duration-100 ease-linear ${
                            isActive ? activeColors[ch] : "border-[#262626] text-[#71717A] hover:border-[#3f3f46]"
                          }`}
                        >
                          {ch}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Subject (Email only) */}
                {formChannels.includes("Email") && (
                  <div>
                    <label className="block text-sm font-medium text-[#FAFAFA] mb-2">Subject Line</label>
                    <input
                      value={formSubject}
                      onChange={(e) => setFormSubject(e.target.value)}
                      placeholder="Email subject..."
                      className="w-full min-h-[44px] px-4 bg-[#0A0A0A] border border-[#262626] rounded-xl text-[#FAFAFA] placeholder-[#71717A] text-sm outline-none focus:border-[#5A4EFF] transition duration-100 ease-linear"
                    />
                  </div>
                )}

                {/* Message body */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-[#FAFAFA]">Message</label>
                    <span className="text-xs text-[#71717A]">{formBody.length}/500</span>
                  </div>
                  <textarea
                    value={formBody}
                    onChange={(e) => { if (e.target.value.length <= 500) setFormBody(e.target.value); }}
                    rows={5}
                    placeholder="Type your broadcast message..."
                    className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#262626] rounded-xl text-[#FAFAFA] placeholder-[#71717A] text-sm outline-none focus:border-[#5A4EFF] resize-none transition duration-100 ease-linear"
                  />
                </div>

                {/* Quick templates */}
                <div>
                  <label className="block text-sm font-medium text-[#FAFAFA] mb-2">Quick Templates</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(TEMPLATE_BODIES).map((t) => (
                      <button
                        key={t}
                        onClick={() => setFormBody(TEMPLATE_BODIES[t])}
                        className="px-3 py-1.5 text-xs bg-[#1a1a1a] border border-[#262626] rounded-lg text-[#A1A1AA] hover:text-[#FAFAFA] hover:border-[#3f3f46] transition duration-100 ease-linear"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                {formBody.trim() && (
                  <div>
                    <label className="block text-sm font-medium text-[#FAFAFA] mb-2">Preview</label>
                    <div className="bg-[#0A0A0A] border border-[#262626] rounded-xl p-4">
                      <div className="flex justify-end">
                        <div className="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-br-md bg-[#5A4EFF] text-white text-sm">
                          <p className="whitespace-pre-wrap">{formBody}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Schedule */}
            {modalStep === 3 && (
              <div className="space-y-5">
                {/* Broadcast title */}
                <div>
                  <label className="block text-sm font-medium text-[#FAFAFA] mb-2">Broadcast Title</label>
                  <input
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. January Welcome Back"
                    className="w-full min-h-[44px] px-4 bg-[#0A0A0A] border border-[#262626] rounded-xl text-[#FAFAFA] placeholder-[#71717A] text-sm outline-none focus:border-[#5A4EFF] transition duration-100 ease-linear"
                  />
                </div>

                {/* Send mode toggle */}
                <div>
                  <label className="block text-sm font-medium text-[#FAFAFA] mb-2">When to Send</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFormScheduleMode("now")}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition duration-100 ease-linear ${
                        formScheduleMode === "now" ? "bg-[#5A4EFF] border-[#5A4EFF] text-white" : "border-[#262626] text-[#71717A] hover:border-[#3f3f46]"
                      }`}
                    >
                      Send Now
                    </button>
                    <button
                      onClick={() => setFormScheduleMode("schedule")}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition duration-100 ease-linear ${
                        formScheduleMode === "schedule" ? "bg-[#5A4EFF] border-[#5A4EFF] text-white" : "border-[#262626] text-[#71717A] hover:border-[#3f3f46]"
                      }`}
                    >
                      Schedule
                    </button>
                  </div>
                </div>

                {/* Schedule inputs */}
                {formScheduleMode === "schedule" && (
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-xs text-[#71717A] mb-1.5">Date</label>
                      <input
                        type="date"
                        value={formDate}
                        onChange={(e) => setFormDate(e.target.value)}
                        className="w-full min-h-[44px] px-4 bg-[#0A0A0A] border border-[#262626] rounded-xl text-[#FAFAFA] text-sm outline-none focus:border-[#5A4EFF] transition duration-100 ease-linear [color-scheme:dark]"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-[#71717A] mb-1.5">Time</label>
                      <input
                        type="time"
                        value={formTime}
                        onChange={(e) => setFormTime(e.target.value)}
                        className="w-full min-h-[44px] px-4 bg-[#0A0A0A] border border-[#262626] rounded-xl text-[#FAFAFA] text-sm outline-none focus:border-[#5A4EFF] transition duration-100 ease-linear [color-scheme:dark]"
                      />
                    </div>
                  </div>
                )}

                {/* Summary */}
                <div className="bg-[#0A0A0A] border border-[#262626] rounded-xl p-4">
                  <p className="text-sm text-[#A1A1AA]">
                    Sending to <span className="text-[#FAFAFA] font-medium">~{SEGMENT_REACH[formSegment]} clients</span> via{" "}
                    <span className="text-[#FAFAFA] font-medium">{formChannels.join(" + ")}</span>{" "}
                    {formScheduleMode === "now" ? (
                      <span className="text-[#FAFAFA] font-medium">now</span>
                    ) : (
                      <>on <span className="text-[#FAFAFA] font-medium">{formDate || "..."} at {formTime || "..."}</span></>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between p-5 border-t border-[#262626]">
            <div>
              {modalStep > 1 && (
                <button onClick={handleBack} className="px-4 py-2.5 text-sm text-[#A1A1AA] hover:text-[#FAFAFA] transition duration-100 ease-linear">Back</button>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setShowModal(false); resetModalForm(); }} className="px-4 py-2.5 text-sm text-[#A1A1AA] hover:text-[#FAFAFA] bg-[#1a1a1a] rounded-xl hover:bg-[#262626] transition duration-100 ease-linear">Cancel</button>
              {modalStep < 3 ? (
                <button onClick={handleNext} className="px-5 py-2.5 text-sm font-medium bg-[#5A4EFF] text-white rounded-xl hover:bg-[#4840E8] transition duration-100 ease-linear">Next</button>
              ) : (
                <button onClick={handleSendBroadcast} className="px-5 py-2.5 text-sm font-medium bg-[#5A4EFF] text-white rounded-xl hover:bg-[#4840E8] transition duration-100 ease-linear">Send Broadcast</button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-[#0A0A0A]">
      {/* View Toggle */}
      <div className="flex items-center gap-1 p-3 border-b border-[#262626] bg-[#111111]">
        <button
          onClick={() => setView("dm")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition duration-100 ease-linear ${
            view === "dm" ? "bg-[#5A4EFF] text-white" : "text-[#71717A] hover:text-[#FAFAFA] hover:bg-[#1a1a1a]"
          }`}
        >
          Direct Messages
        </button>
        <button
          onClick={() => setView("broadcasts")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition duration-100 ease-linear ${
            view === "broadcasts" ? "bg-[#5A4EFF] text-white" : "text-[#71717A] hover:text-[#FAFAFA] hover:bg-[#1a1a1a]"
          }`}
        >
          Broadcasts
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex min-h-0">
        {view === "dm" ? (
          <>
            {/* Desktop: both panels. Mobile: one or the other */}
            <div className={`w-full lg:w-80 lg:border-r lg:border-[#262626] bg-[#111111] shrink-0 ${mobileShowChat ? "hidden lg:block" : "block"}`}>
              <ConversationList />
            </div>
            <div className={`flex-1 ${!mobileShowChat ? "hidden lg:flex" : "flex"}`}>
              <ChatPanel />
            </div>
          </>
        ) : (
          <BroadcastsView />
        )}
      </div>

      {/* Modal */}
      <BroadcastModal />
    </div>
  );
}
