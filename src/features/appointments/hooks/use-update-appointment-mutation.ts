import { UseFormReturn } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import type { ActionError } from "@/shared/types";
import {
  optimisticAdd,
  optimisticRemove,
  optimisticUpdate,
} from "@/shared/utils/optimistic-helpers";

import {
  updateAppointment,
  type UpdateAppointmentErrorCode,
} from "@/features/appointments/actions/update-appointment";
import type {
  UpdateAppointmentVariables,
  CalendarEvent,
  IncomingAppointment,
} from "@/features/appointments/types";

interface Props {
  form: UseFormReturn<UpdateAppointmentVariables>;
}

export const useUpdateAppointmentMutation = ({ form }: Props) => {
  const queryClient = useQueryClient();
  const t = useTranslations(
    "features.appointments.use-update-appointment-mutation",
  );

  return useMutation({
    mutationFn: async (variables: UpdateAppointmentVariables) => {
      const { data, error } = await updateAppointment(variables);

      if (error) return Promise.reject(error);

      return data;
    },
    onSuccess: async (data, variables) => {
      //check if data is an available appointment
      if ("id" in data && variables.status === "available") {
        optimisticUpdate<CalendarEvent>(
          queryClient,
          ["appointment", "list", "calendar"],
          (calendarAppointment) => calendarAppointment.id === data.id,
          (calendarAppointment) => ({
            ...calendarAppointment,
            title: "available",
            color: "emerald",
          }),
        );

        optimisticRemove<IncomingAppointment>(
          queryClient,
          ["appointment", "list", "incoming"],
          (incomingAppointment) =>
            incomingAppointment.appointment.id === data.id,
        );
      }

      //check if data is an incoming appointment
      if (
        "patient" in data &&
        variables.status === "booked" &&
        variables.patientIdentificationNumber
      ) {
        optimisticUpdate<CalendarEvent>(
          queryClient,
          ["appointment", "list", "calendar"],
          (calendarAppointment) =>
            calendarAppointment.id === data.appointment.id,
          (calendarAppointment) => ({
            ...calendarAppointment,
            title: "booked",
            color: "sky",
          }),
        );

        optimisticAdd<IncomingAppointment>(
          queryClient,
          ["appointment", "list", "incoming"],
          {
            appointment: data.appointment,
            patient: data.patient,
          },
        );
      }

      toast.success(t("success-toast"));
    },
    onError: (error: ActionError<UpdateAppointmentErrorCode>) => {
      console.log(error);

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
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["appointment", "details", variables.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["appointment", "list", "incoming"],
      });

      queryClient.invalidateQueries({
        queryKey: ["appointment", "list", "calendar"],
      });
    },
  });
};
