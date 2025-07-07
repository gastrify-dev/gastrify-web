import { useTranslations } from "next-intl";

import { TypographyH1, TypographyH3 } from "@/shared/components/ui/typography";

import { Appointments } from "@/features/appointments/components/appointments";
import { UserAppointments } from "@/features/appointments/components/user-appointments";

export function UserAppointmentsPage() {
  const t = useTranslations("features.appointments.user-appointments-page");

  return (
    <div className="flex h-full flex-col gap-6 pr-6">
      <TypographyH1>{t("title")}</TypographyH1>

      <TypographyH3>{t("my-appointments-title")}</TypographyH3>

      <UserAppointments />

      <TypographyH3>{t("book-appointment-title")}</TypographyH3>

      <Appointments />
    </div>
  );
}
