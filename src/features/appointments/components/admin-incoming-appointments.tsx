"use client";

import { LoaderIcon } from "lucide-react";

import { Button } from "@/shared/components/ui/button";

import { AdminIncomingAppointmentCard } from "@/features/appointments/components/admin-incoming-appointment-card";
import { AdminIncomingAppointmentCardSkeleton } from "@/features/appointments/components/admin-incoming-appointment-card-skeleton";
import { useAdminIncomingAppointments } from "@/features/appointments/hooks/use-admin-incoming-appointments";

export function AdminIncomingAppointments() {
  const { data, isLoading, isError, refetch, isRefetching, t } =
    useAdminIncomingAppointments();

  if (isLoading) return <AdminIncomingAppointmentCardSkeleton />;

  if (isError)
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        {t("error-message")}
        <Button
          disabled={isRefetching}
          variant="destructive"
          onClick={() => refetch()}
        >
          {isRefetching && <LoaderIcon className="animate-spin" />}
          {t("refetch-button")}
        </Button>
      </div>
    );

  if (!data || data.length === 0)
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        {t("no-appointments-message")}
      </div>
    );

  return (
    <div className="flex flex-col gap-4">
      {data?.map((incomingAppointment) => (
        <AdminIncomingAppointmentCard
          key={incomingAppointment.appointment.id}
          incomingAppointment={incomingAppointment}
        />
      ))}
    </div>
  );
}
