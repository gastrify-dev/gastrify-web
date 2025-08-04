import Link from "next/link";
import {
  formatDuration,
  intervalToDuration,
  format,
  formatDistanceToNow,
} from "date-fns";
import { LoaderIcon, RotateCcwIcon } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/shared/components/ui/card";
import { TypographyP } from "@/shared/components/ui/typography";

import { useAdminIncomingAppointmentCard } from "@/features/appointments/hooks/use-admin-incoming-appointment-card";
import type { IncomingAppointment } from "@/features/appointments/types";

interface Props {
  incomingAppointment: IncomingAppointment;
}

export function AdminIncomingAppointmentCard({ incomingAppointment }: Props) {
  const {
    isDeleteAppointmentPending,
    isDeleteAppointmentError,
    handleDeleteAppointment,
    t,
  } = useAdminIncomingAppointmentCard();

  return (
    <Card className="flex flex-col gap-2">
      <CardHeader>
        <CardTitle>
          {incomingAppointment.appointment.type === "in-person"
            ? t("in-person")
            : t("virtual")}{" "}
          (
          {formatDistanceToNow(incomingAppointment.appointment.start, {
            addSuffix: true,
          })}
          )
        </CardTitle>

        <CardDescription className="flex items-center gap-42">
          <div className="flex flex-col">
            <TypographyP className="!mt-2 leading-normal">
              <span className="font-bold">{t("start")}:</span>{" "}
              {format(incomingAppointment.appointment.start, "PPp")}
            </TypographyP>

            <TypographyP className="!m-0 leading-normal">
              <span className="font-bold">{t("end")}:</span>{" "}
              {format(incomingAppointment.appointment.end, "PPp")}
            </TypographyP>

            <TypographyP className="!m-0 leading-normal">
              <span className="font-bold">{t("duration")}:</span>{" "}
              {formatDuration(
                intervalToDuration({
                  start: incomingAppointment.appointment.start,
                  end: incomingAppointment.appointment.end,
                }),
              )}
            </TypographyP>

            {incomingAppointment.appointment.location && (
              <TypographyP className="!m-0 leading-normal">
                <span className="font-bold">{t("location-label")}</span>{" "}
                {incomingAppointment.appointment.location}
              </TypographyP>
            )}

            {incomingAppointment.appointment.meetingLink && (
              <TypographyP className="!m-0 leading-normal">
                <span className="font-bold">{t("meeting-link-label")}</span>{" "}
                <br />
                <Link
                  href={incomingAppointment.appointment.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all"
                >
                  {incomingAppointment.appointment.meetingLink}
                </Link>
              </TypographyP>
            )}
          </div>

          <div className="flex flex-col">
            <TypographyP className="!m-0 leading-normal">
              <span className="font-bold">{t("patient")}:</span>{" "}
              {incomingAppointment.patient.name}
            </TypographyP>

            <TypographyP className="!m-0 leading-normal">
              <span className="font-bold">
                {t("patient-identification-number")}:
              </span>{" "}
              {incomingAppointment.patient.identificationNumber}
            </TypographyP>

            <TypographyP className="!m-0 leading-normal">
              <span className="font-bold">{t("patient-email")}:</span>{" "}
              {incomingAppointment.patient.email}
            </TypographyP>
          </div>
        </CardDescription>

        <CardAction>
          <Button
            disabled={isDeleteAppointmentPending}
            variant="destructive"
            onClick={() =>
              handleDeleteAppointment(incomingAppointment.appointment.id)
            }
          >
            {isDeleteAppointmentPending && (
              <LoaderIcon className="animate-spin" />
            )}
            {isDeleteAppointmentError && <RotateCcwIcon />}
            {t("delete")}
          </Button>
        </CardAction>
      </CardHeader>
    </Card>
  );
}
