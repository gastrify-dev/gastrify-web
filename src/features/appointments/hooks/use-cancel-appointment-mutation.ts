import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useSession } from "@/shared/hooks/use-session";
import {
  optimisticRemove,
  optimisticUpdate,
  rollback,
} from "@/shared/utils/optimistic-helpers";

import { cancelAppointment } from "@/features/appointments/actions/cancel-appointment";
import type {
  Appointment,
  CalendarEvent,
  CancelAppointmentVariables,
} from "@/features/appointments/types";

export const useCancelAppointmentMutation = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const t = useTranslations(
    "features.appointments.use-cancel-appointment-mutation",
  );

  return useMutation({
    mutationFn: async (variables: CancelAppointmentVariables) => {
      const { error } = await cancelAppointment(variables);

      if (error) return Promise.reject(error);
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["appointment", "list", "calendar"],
      });
      await queryClient.cancelQueries({
        queryKey: ["appointment", "list", "user", session?.user?.id],
      });

      const previousCalendarAppointments = optimisticUpdate<CalendarEvent>(
        queryClient,
        ["appointment", "list", "calendar"],
        (calendarAppointment) =>
          calendarAppointment.id === variables.appointmentId,
        (calendarAppointment) => ({
          ...calendarAppointment,
          title: "available",
          color: "emerald",
        }),
      );

      const previousUserAppointments = optimisticRemove<Appointment>(
        queryClient,
        ["appointment", "list", "user", session?.user?.id],
        (appointment) => appointment.id === variables.appointmentId,
      );

      return { previousCalendarAppointments, previousUserAppointments };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousCalendarAppointments) {
        rollback<CalendarEvent>(
          queryClient,
          ["appointment", "list", "calendar"],
          context.previousCalendarAppointments,
        );
      }
      if (context?.previousUserAppointments) {
        rollback<Appointment>(
          queryClient,
          ["appointment", "list", "user", session?.user?.id],
          context.previousUserAppointments,
        );
      }

      toast.error(t("error-toast"), {
        description: t("error-toast-description"),
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["appointment", "list", "user", session?.user?.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["appointment", "list", "calendar"],
      });

      queryClient.invalidateQueries({
        queryKey: ["notification", "list"],
      });
    },
  });
};
