"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { getAllAppointments } from "@/features/appointments/actions/get-all-appointments";
import { EventCalendar } from "@/features/appointments/components/event-calendar";

export function Appointments() {
  const t = useTranslations("features.appointments.appointments");

  const { data, isError } = useQuery({
    queryKey: ["appointment", "list", "calendar"],
    queryFn: async () => {
      const { data, error } = await getAllAppointments();

      if (error) return Promise.reject(error);

      return data;
    },
  });

  if (isError)
    toast.error(t("error-toast"), {
      description: t("error-toast-description"),
    });

  return <EventCalendar initialView="agenda" events={data} />;
}
