"use client";

import { LoaderIcon, RotateCcwIcon } from "lucide-react";
import { formatDuration, intervalToDuration, format } from "date-fns";
import Link from "next/link";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/shared/components/ui/card";
import { TypographyP } from "@/shared/components/ui/typography";

import { useAppointmentCard } from "@/features/appointments/hooks/use-appointment-card";
import type { Appointment } from "@/features/appointments/types";

interface Props {
  appointment: Appointment;
}

export function UserAppointmentCard({ appointment }: Props) {
  const {
    isCancelAppointmentPending,
    isCancelAppointmentError,
    handleCancelAppointment,
    t,
  } = useAppointmentCard();

  return (
    <Card className="flex flex-col gap-2">
      <CardHeader>
        <CardTitle>
          {t(
            appointment.type === "in-person"
              ? "in-person-title"
              : "virtual-title",
          )}
        </CardTitle>

        <CardDescription className="flex flex-col">
          <TypographyP className="!mt-2 leading-normal">
            <span className="font-bold">{t("start-label")}</span>{" "}
            {format(appointment.start, "PPp")}
          </TypographyP>

          <TypographyP className="!m-0 leading-normal">
            <span className="font-bold">{t("end-label")}</span>{" "}
            {format(appointment.end, "PPp")}
          </TypographyP>

          <TypographyP className="!m-0 leading-normal">
            <span className="font-bold">{t("duration-label")}</span>{" "}
            {formatDuration(
              intervalToDuration({
                start: appointment.start,
                end: appointment.end,
              }),
            )}
          </TypographyP>

          {appointment.type === "in-person" && (
            <TypographyP className="!m-0 leading-normal">
              <span className="font-bold">{t("location-label")}</span> Clínica
              Kennedy, Guayaquil, Guayas
            </TypographyP>
          )}

          {appointment.meetingLink && (
            <TypographyP className="!m-0 leading-normal">
              <span className="font-bold">{t("meeting-link-label")}</span>{" "}
              <Link
                href={appointment.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {appointment.meetingLink}
              </Link>
            </TypographyP>
          )}
        </CardDescription>

        <CardAction>
          <Button
            disabled={isCancelAppointmentPending}
            variant="destructive"
            onClick={() => handleCancelAppointment(appointment.id)}
          >
            {isCancelAppointmentPending && (
              <LoaderIcon className="animate-spin" />
            )}
            {isCancelAppointmentError && <RotateCcwIcon />}
            {t("cancel-button")}
          </Button>
        </CardAction>
      </CardHeader>
    </Card>
  );
}
