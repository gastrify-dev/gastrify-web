import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import {
  optimisticAdd,
  optimisticSet,
  rollback,
} from "@/shared/utils/optimistic-helpers";

import { bookAppointment } from "@/features/appointments/actions/book-appointment";
import type {
  Appointment,
  BookAppointmentVariables,
  CalendarEvent,
} from "@/features/appointments/types";

export const useBookAppointmentMutation = () => {
  const queryClient = useQueryClient();

  const t = useTranslations(
    "features.appointments.use-book-appointment-mutation",
  );

  return useMutation({
    mutationFn: async (variables: BookAppointmentVariables) => {
      const { error } = await bookAppointment(variables);

      if (error) return Promise.reject(error);
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["appointment", "list", "calendar"],
      });
      await queryClient.cancelQueries({
        queryKey: ["appointment", "list", "user", variables.patientId],
      });

      let bookedCalendarAppointment: CalendarEvent = {} as CalendarEvent;

      const previousCalendarAppointments = optimisticSet<CalendarEvent>(
        queryClient,
        ["appointment", "list", "calendar"],
        (oldCalendarAppointments) =>
          oldCalendarAppointments.map((calendarAppointment) => {
            if (calendarAppointment.id === variables.appointmentId) {
              bookedCalendarAppointment = {
                ...calendarAppointment,
                title: "booked",
                color: "sky",
              };

              return bookedCalendarAppointment;
            }

            return calendarAppointment;
          }),
      );

      const previousUserAppointments = optimisticAdd<Appointment>(
        queryClient,
        ["appointment", "list", "user", variables.patientId],
        {
          id: variables.appointmentId,
          start: bookedCalendarAppointment.start,
          end: bookedCalendarAppointment.end,
          status: "booked",
          patientId: variables.patientId,
          type: variables.appointmentType,
          location: null,
          meetingLink: null,
          createdAt: new Date(),
        },
      );

      return {
        previousCalendarAppointments,
        previousUserAppointments,
      };
    },
    onError: (_error, variables, context) => {
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
          ["appointment", "list", "user", variables.patientId],
          context.previousUserAppointments,
        );
      }

      toast.error(t("error-toast"), {
        description: t("error-toast-description"),
      });
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["appointment", "list", "user", variables.patientId],
      });

      queryClient.invalidateQueries({
        queryKey: ["appointment", "list", "calendar"],
      });
    },
  });
};
