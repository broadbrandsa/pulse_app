import { redirect } from "next/navigation";

export default function Page() {
  redirect("/coaching?tab=nutrition");
}
