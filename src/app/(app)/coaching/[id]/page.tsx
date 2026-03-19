import { redirect } from "next/navigation";

export default async function CoachingDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    redirect(`/programmes/${id}`);
}
