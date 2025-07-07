import { useTranslations } from "next-intl";

import { useCancelAppointmentMutation } from "@/features/appointments/hooks/use-cancel-appointment-mutation";

export const useAppointmentCard = () => {
  const {
    mutate: cancelAppointment,
    isPending: isCancelAppointmentPending,
    isError: isCancelAppointmentError,
  } = useCancelAppointmentMutation();

  const handleCancelAppointment = (appointmentId: string) =>
    cancelAppointment({ appointmentId });

  const t = useTranslations("features.appointments.user-appointment-card");

  return {
    isCancelAppointmentPending,
    isCancelAppointmentError,
    handleCancelAppointment,
    t,
  };
};
