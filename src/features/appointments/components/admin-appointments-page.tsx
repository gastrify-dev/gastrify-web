import { useTranslations } from "next-intl";

import { TypographyH1, TypographyH3 } from "@/shared/components/ui/typography";

import { AdminIncomingAppointments } from "@/features/appointments/components/admin-incoming-appointments";
import { Appointments } from "@/features/appointments/components/appointments";

export function AdminAppointmentsPage() {
  const t = useTranslations("features.appointments.admin-appointments-page");

  return (
    <div className="flex h-full flex-col gap-6 pr-6">
      <TypographyH1>{t("title")}</TypographyH1>

      <div className="flex flex-1 gap-6">
        <div className="flex w-1/3 flex-col gap-6">
          <TypographyH3>{t("incoming-appointments-title")}</TypographyH3>
          <AdminIncomingAppointments />
        </div>

        <div className="flex w-2/3 flex-col gap-6">
          <TypographyH3>{t("manage-appointments-title")}</TypographyH3>
          <Appointments />
        </div>
      </div>
    </div>
  );
}
