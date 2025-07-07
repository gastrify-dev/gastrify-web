import { useTranslations } from "next-intl";

import { useDeleteAppointmentMutation } from "@/features/appointments/hooks/use-delete-appointment-mutation";

export const useAdminIncomingAppointmentCard = () => {
  const {
    mutate: deleteAppointment,
    isPending: isDeleteAppointmentPending,
    isError: isDeleteAppointmentError,
  } = useDeleteAppointmentMutation();

  const handleDeleteAppointment = (appointmentId: string) =>
    deleteAppointment({ appointmentId });

  const t = useTranslations(
    "features.appointments.admin-incoming-appointment-card",
  );

  return {
    isDeleteAppointmentPending,
    isDeleteAppointmentError,
    handleDeleteAppointment,
    t,
  };
};
