"use client";

import { useState, useRef, useEffect } from "react";
import {
    MessageSquare01,
    SearchLg,
    Send01,
    Plus,
    Phone01,
} from "@untitledui/icons";

// -- Types ------------------------------------------------------------------------

type Message = {
    id: number;
    from: "client" | "studio";
    text: string;
    time: string;
};

type Conversation = {
    id: number;
    name: string;
    initials: string;
    lastMessage: string;
    time: string;
    unread: number;
    messages: Message[];
};

// -- Mock Data --------------------------------------------------------------------

const initialConversations: Conversation[] = [
    {
        id: 1,
        name: "Kefilwe Molefe",
        initials: "KM",
        lastMessage: "Can I book a spot for the Sound Bath workshop on Saturday?",
        time: "10:15",
        unread: 1,
        messages: [
            { id: 1, from: "client", text: "Hi! I saw the Sound Bath workshop on your Instagram. Is there still space for Saturday?", time: "10:00" },
            { id: 2, from: "studio", text: "Hi Kefilwe! Yes, we have 3 spots left. Would you like me to reserve one for you?", time: "10:05" },
            { id: 3, from: "client", text: "Can I book a spot for the Sound Bath workshop on Saturday?", time: "10:15" },
        ],
    },
    {
        id: 2,
        name: "Lerato Phiri",
        initials: "LP",
        lastMessage: "When does my monthly membership renew?",
        time: "Yesterday",
        unread: 1,
        messages: [
            { id: 1, from: "client", text: "Hi Amahle, quick question \u2014 when does my monthly membership renew?", time: "Yesterday" },
            { id: 2, from: "studio", text: "Hi Lerato! Your membership renews on the 1st of each month. You\u2019re currently on the Monthly Unlimited plan.", time: "Yesterday" },
            { id: 3, from: "client", text: "When does my monthly membership renew?", time: "Yesterday" },
        ],
    },
    {
        id: 3,
        name: "Ubuntu Yoga Studio",
        initials: "UY",
        lastMessage: "New Sunday 8am Yin class starting next week!",
        time: "Mon",
        unread: 0,
        messages: [
            { id: 1, from: "studio", text: "Exciting news! We\u2019re adding a new Sunday 8am Yin Yoga class starting next week. Perfect for a slow, mindful start to your Sunday.", time: "Mon" },
            { id: 2, from: "studio", text: "New Sunday 8am Yin class starting next week!", time: "Mon" },
        ],
    },
    {
        id: 4,
        name: "Priya Chetty",
        initials: "PC",
        lastMessage: "My 5-class pass expires soon, can I extend it?",
        time: "Sun",
        unread: 1,
        messages: [
            { id: 1, from: "client", text: "Hi, I have 1 class left on my 5-class pass but it expires in 2 days. Is there any way to extend it?", time: "Sun" },
            { id: 2, from: "client", text: "My 5-class pass expires soon, can I extend it?", time: "Sun" },
        ],
    },
];

// -- Quick Replies ----------------------------------------------------------------

const QUICK_REPLIES = [
    "Your booking is confirmed! Namaste \u{1F64F}",
    "We\u2019ll see you on the mat!",
    "Let me check availability for you.",
    "Your pass has been updated.",
    "Thanks for practising with Ubuntu Yoga!",
];

// -- Page Component ---------------------------------------------------------------

export default function YogaMessagesPage() {
    const [conversations, setConversations] = useState(initialConversations);
    const [activeId, setActiveId] = useState<number | null>(null);
    const [search, setSearch] = useState("");
    const [input, setInput] = useState("");
    const [mobileShowChat, setMobileShowChat] = useState(false);
    const [showQuickReplies, setShowQuickReplies] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const active = conversations.find((c) => c.id === activeId) ?? null;
    const filtered = conversations.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()),
    );

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [active?.messages.length]);

    const openConversation = (id: number) => {
        setActiveId(id);
        setMobileShowChat(true);
        setConversations((prev) =>
            prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)),
        );
    };

    const sendMessage = (text: string) => {
        if (!text.trim() || !activeId) return;
        const msg: Message = {
            id: Date.now(),
            from: "studio",
            text: text.trim(),
            time: "Now",
        };
        setConversations((prev) =>
            prev.map((c) =>
                c.id === activeId
                    ? { ...c, messages: [...c.messages, msg], lastMessage: text.trim(), time: "Now" }
                    : c,
            ),
        );
        setInput("");
        setShowQuickReplies(false);
    };

    // -- Conversation List --------------------------------------------------------

    const ConversationList = () => (
        <div className="flex h-full flex-col">
            <div className="border-b border-[var(--pa-border-default)] p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <MessageSquare01 className="size-5 text-[#14B8A6]" />
                        <h1 className="text-xl font-bold text-[var(--pa-text-primary)]">Messages</h1>
                    </div>
                    <button className="flex size-9 items-center justify-center rounded-xl bg-[#14B8A6] text-white transition duration-100 ease-linear hover:bg-[#0D9488]">
                        <Plus className="size-4" />
                    </button>
                </div>
                <div className="relative mt-3">
                    <SearchLg className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--pa-text-muted)]" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search conversations..."
                        className="w-full min-h-[44px] rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] pl-10 pr-4 text-sm text-[var(--pa-text-primary)] placeholder-[var(--pa-text-muted)] outline-none transition duration-100 ease-linear focus:border-[#14B8A6]"
                    />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                {filtered.map((c) => (
                    <button
                        key={c.id}
                        onClick={() => openConversation(c.id)}
                        className={`flex w-full items-center gap-3 p-4 text-left transition duration-100 ease-linear hover:bg-[var(--pa-bg-elevated)] ${
                            activeId === c.id ? "bg-[#14B8A6]/10" : ""
                        }`}
                    >
                        <div className="relative shrink-0">
                            <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-[#14B8A6] to-[#5EEAD4] text-sm font-medium text-white">
                                {c.initials}
                            </div>
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                                <span className="truncate text-sm font-medium text-[var(--pa-text-primary)]">{c.name}</span>
                                <span className="ml-2 shrink-0 text-xs text-[var(--pa-text-muted)]">{c.time}</span>
                            </div>
                            <p className="truncate text-sm text-[var(--pa-text-muted)]">{c.lastMessage}</p>
                        </div>
                        {c.unread > 0 && (
                            <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#14B8A6] text-xs text-white">
                                {c.unread}
                            </div>
                        )}
                    </button>
                ))}
                {filtered.length === 0 && (
                    <div className="p-8 text-center text-sm text-[var(--pa-text-muted)]">
                        No conversations found
                    </div>
                )}
            </div>
        </div>
    );

    // -- Chat Panel ---------------------------------------------------------------

    const ChatPanel = () => {
        if (!active) {
            return (
                <div className="hidden flex-1 items-center justify-center text-[var(--pa-text-muted)] lg:flex">
                    <div className="text-center">
                        <MessageSquare01 className="mx-auto mb-3 size-12 text-[var(--pa-bg-elevated)]" />
                        <p>Select a conversation to start messaging</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="flex h-full flex-1 flex-col">
                {/* Chat Header */}
                <div className="flex items-center justify-between border-b border-[var(--pa-border-default)] p-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileShowChat(false)}
                            className="flex size-8 items-center justify-center text-[var(--pa-text-secondary)] lg:hidden"
                        >
                            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-[#14B8A6] to-[#5EEAD4] text-sm font-medium text-white">
                            {active.initials}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-[var(--pa-text-primary)]">{active.name}</p>
                            <p className="text-xs text-[var(--pa-text-muted)]">Student</p>
                        </div>
                    </div>
                    <button className="flex size-9 items-center justify-center rounded-xl text-[var(--pa-text-secondary)] transition duration-100 ease-linear hover:bg-[var(--pa-bg-elevated)] hover:text-[var(--pa-text-primary)]">
                        <Phone01 className="size-5" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 space-y-3 overflow-y-auto p-4">
                    {active.messages.map((m) => (
                        <div
                            key={m.id}
                            className={`flex ${m.from === "studio" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                                    m.from === "studio"
                                        ? "rounded-br-md bg-[#14B8A6] text-white"
                                        : "rounded-bl-md bg-[var(--pa-bg-elevated)] text-[var(--pa-text-primary)]"
                                }`}
                            >
                                <p>{m.text}</p>
                                <p
                                    className={`mt-1 text-[10px] ${
                                        m.from === "studio" ? "text-white/60" : "text-[var(--pa-text-muted)]"
                                    }`}
                                >
                                    {m.time}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Replies */}
                {showQuickReplies && (
                    <div className="px-4 pb-2">
                        <div className="space-y-1 rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-elevated)] p-2">
                            {QUICK_REPLIES.map((qr) => (
                                <button
                                    key={qr}
                                    onClick={() => sendMessage(qr)}
                                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-[var(--pa-text-secondary)] transition duration-100 ease-linear hover:bg-[var(--pa-bg-hover)] hover:text-[var(--pa-text-primary)]"
                                >
                                    {qr}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input */}
                <div className="border-t border-[var(--pa-border-default)] p-4">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowQuickReplies(!showQuickReplies)}
                            className={`flex size-10 shrink-0 items-center justify-center rounded-xl transition duration-100 ease-linear ${
                                showQuickReplies
                                    ? "bg-[#14B8A6] text-white"
                                    : "bg-[var(--pa-bg-elevated)] text-[var(--pa-text-muted)] hover:text-[var(--pa-text-primary)]"
                            }`}
                        >
                            <Plus className="size-5" />
                        </button>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                            placeholder="Type a message..."
                            className="min-h-[44px] flex-1 rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] px-4 text-sm text-[var(--pa-text-primary)] placeholder-[var(--pa-text-muted)] outline-none transition duration-100 ease-linear focus:border-[#14B8A6]"
                        />
                        <button
                            onClick={() => sendMessage(input)}
                            disabled={!input.trim()}
                            className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#14B8A6] text-white transition duration-100 ease-linear hover:bg-[#0D9488] disabled:opacity-40"
                        >
                            <Send01 className="size-5" />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // -- Layout -------------------------------------------------------------------

    return (
        <div className="flex h-[calc(100vh-64px)] flex-col bg-[var(--pa-bg-base)]">
            <div className="flex min-h-0 flex-1">
                <div
                    className={`w-full shrink-0 border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] lg:w-80 lg:border-r ${
                        mobileShowChat ? "hidden lg:block" : "block"
                    }`}
                >
                    <ConversationList />
                </div>
                <div className={`flex-1 ${!mobileShowChat ? "hidden lg:flex" : "flex"}`}>
                    <ChatPanel />
                </div>
            </div>
        </div>
    );
}
