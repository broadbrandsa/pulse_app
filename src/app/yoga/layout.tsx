import { YogaAppLayout } from "@/components/layout/yoga-app-layout";

export default function YogaGroupLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <YogaAppLayout>{children}</YogaAppLayout>;
}
