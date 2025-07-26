import { UseFormReturn } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { ActionError } from "@/shared/types";
import { optimisticAdd } from "@/shared/utils/optimistic-helpers";

import {
  createAppointment,
  type CreateAppointmentErrorCode,
} from "@/features/appointments/actions/create-appointment";
import type {
  CreateAppointmentVariables,
  CalendarEvent,
  IncomingAppointment,
} from "@/features/appointments/types";

interface Props {
  form: UseFormReturn<CreateAppointmentVariables>;
}

export const useCreateAppointmentMutation = ({ form }: Props) => {
  const queryClient = useQueryClient();

  const t = useTranslations(
    "features.appointments.use-create-appointment-mutation",
  );

  return useMutation({
    mutationFn: async (variables: CreateAppointmentVariables) => {
      const { data, error } = await createAppointment(variables);

      if (error) return Promise.reject(error);

      return data;
    },
    onSuccess: async (data, variables) => {
      //check if data is an incoming appointment
      if (
        "patient" in data &&
        variables.status === "booked" &&
        variables.patientIdentificationNumber
      ) {
        optimisticAdd<IncomingAppointment>(
          queryClient,
          ["appointment", "list", "incoming"],
          {
            appointment: data.appointment,
            patient: data.patient,
          },
        );

        optimisticAdd<CalendarEvent>(
          queryClient,
          ["appointment", "list", "calendar"],
          {
            id: data.appointment.id,
            title: "booked",
            start: data.appointment.start,
            end: data.appointment.end,
            color: "sky",
          },
        );
      }

      //check if data is an available appointment
      if ("id" in data && variables.status === "available") {
        optimisticAdd<CalendarEvent>(
          queryClient,
          ["appointment", "list", "calendar"],
          {
            id: data.id,
            title: "available",
            start: variables.start,
            end: variables.end,
            color: "emerald",
          },
        );
      }

      toast.success(t("success-toast"));
    },
    onError: (error: ActionError<CreateAppointmentErrorCode>) => {
      switch (error.code) {
        case "CONFLICT":
          form.setError("start", {
            message: t("error-conflict-message"),
          });
          form.setError("end", {
            message: t("error-conflict-message"),
          });
          break;

        case "USER_NOT_FOUND":
          form.setError("patientIdentificationNumber", {
            message: t("error-user-not-found-message"),
          });
          break;

        default:
          toast.error(t("error-toast"), {
            description: t("error-toast-description"),
          });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["appointment", "list", "incoming"],
      });

      queryClient.invalidateQueries({
        queryKey: ["appointment", "list", "calendar"],
      });
    },
  });
};
