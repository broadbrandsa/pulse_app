import type { Metadata, Viewport } from "next";
import { Rubik } from "next/font/google";
import { RouteProvider } from "@/providers/router-provider";
import { Theme } from "@/providers/theme";
import "@/styles/globals.css";
import { cx } from "@/utils/cx";

const rubik = Rubik({
    subsets: ["latin"],
    weight: ["400", "500", "600", "800"],
    variable: "--font-rubik",
});

export const metadata: Metadata = {
    title: "PulseApp — Personal Training",
    description: "Personal training business management",
};

export const viewport: Viewport = {
    themeColor: "#5A4EFF",
    colorScheme: "dark",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="" suppressHydrationWarning>
            <body
                className={cx(rubik.variable, "antialiased")}
                style={{ backgroundColor: "var(--pa-bg-base)", fontFamily: "var(--font-rubik), system-ui, sans-serif" }}
            >
                <RouteProvider>
                    <Theme>{children}</Theme>
                </RouteProvider>
            </body>
        </html>
    );
}
