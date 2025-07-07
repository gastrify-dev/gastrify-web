"use client";

import { LoaderIcon } from "lucide-react";

import { Button } from "@/shared/components/ui/button";

import { TypographyP } from "@/shared/components/ui/typography";

import { useUserAppointments } from "@/features/appointments/hooks/use-user-appointments";
import { UserAppointmentCard } from "@/features/appointments/components/user-appointment-card";
import { UserAppointmentsSkeleton } from "@/features/appointments/components/user-appointments-skeleton";

export function UserAppointments() {
  const { data, isLoading, isError, refetch, isRefetching, t } =
    useUserAppointments();

  if (isLoading) return <UserAppointmentsSkeleton />;

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
      <TypographyP className="!m-0 text-center leading-normal">
        {t("no-appointments-message")}
      </TypographyP>
    );

  return (
    <div className="flex flex-col gap-4">
      {data?.map((appointment) => (
        <UserAppointmentCard key={appointment.id} appointment={appointment} />
      ))}
    </div>
  );
}
