import { SalonAppLayout } from "@/components/layout/salon-app-layout";

export default function SalonGroupLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <SalonAppLayout>{children}</SalonAppLayout>;
}
