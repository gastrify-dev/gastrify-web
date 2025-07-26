import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { optimisticRemove, rollback } from "@/shared/utils/optimistic-helpers";

import { deleteAppointment } from "@/features/appointments/actions/delete-appointment";
import type {
  CalendarEvent,
  DeleteAppointmentVariables,
  IncomingAppointment,
} from "@/features/appointments/types";

export const useDeleteAppointmentMutation = () => {
  const queryClient = useQueryClient();

  const t = useTranslations(
    "features.appointments.use-delete-appointment-mutation",
  );

  return useMutation({
    mutationFn: async (variables: DeleteAppointmentVariables) => {
      const { error } = await deleteAppointment(variables);

      if (error) return Promise.reject(error);
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["appointment", "list", "calendar"],
      });
      await queryClient.cancelQueries({
        queryKey: ["appointment", "list", "incoming"],
      });

      const previousCalendarAppointments = optimisticRemove<CalendarEvent>(
        queryClient,
        ["appointment", "list", "calendar"],
        (appointment) => appointment.id === variables.appointmentId,
      );

      const previousIncomingAppointments =
        optimisticRemove<IncomingAppointment>(
          queryClient,
          ["appointment", "list", "incoming"],
          (incomingAppointment) =>
            incomingAppointment.appointment.id === variables.appointmentId,
        );

      return { previousCalendarAppointments, previousIncomingAppointments };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousCalendarAppointments) {
        rollback<CalendarEvent>(
          queryClient,
          ["appointment", "list", "calendar"],
          context.previousCalendarAppointments,
        );
      }

      if (context?.previousIncomingAppointments) {
        rollback<IncomingAppointment>(
          queryClient,
          ["appointment", "list", "incoming"],
          context.previousIncomingAppointments,
        );
      }

      toast.error(t("error-toast"), {
        description: t("error-toast-description"),
      });
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["appointment", "details", variables.appointmentId],
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
