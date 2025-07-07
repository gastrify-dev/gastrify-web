import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { auth } from "@/shared/lib/better-auth/server";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

import { AdminAppointmentsPage } from "@/features/appointments/components/admin-appointments-page";
import { UserAppointmentsPage } from "@/features/appointments/components/user-appointments-page";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app.appointments-page");

  return {
    title: t("meta-title"),
    description: t("meta-description"),
  };
}

export default async function AppointmentsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  const isAdmin = session.user.role === "admin";

  return (
    <ScrollArea className="h-full">
      {isAdmin ? <AdminAppointmentsPage /> : <UserAppointmentsPage />}
    </ScrollArea>
  );
}
