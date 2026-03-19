export function formatCurrency(amount: number): string {
    return `R${amount.toLocaleString("en-ZA")}`;
}

export function formatCurrencyCompact(amount: number): string {
    if (amount >= 1000) {
        return `R${(amount / 1000).toFixed(1)}k`;
    }
    return `R${amount.toLocaleString("en-ZA")}`;
}

export function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-ZA", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export function formatTime(timeStr: string): string {
    return timeStr;
}

export function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
}

export function getCurrentDate(): string {
    return new Date().toLocaleDateString("en-ZA", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}
