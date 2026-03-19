"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "pulseapp.sidebarCollapsed";

export function useSidebarState() {
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored !== null) setCollapsed(stored === "true");
        } catch {}
    }, []);

    const toggle = () =>
        setCollapsed((prev) => {
            const next = !prev;
            try {
                localStorage.setItem(STORAGE_KEY, String(next));
            } catch {}
            return next;
        });

    return { collapsed, toggle };
}
