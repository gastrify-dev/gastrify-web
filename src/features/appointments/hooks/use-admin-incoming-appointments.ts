import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { getIncomingAppointments } from "@/features/appointments/actions/get-incoming-appointments";

export function useAdminIncomingAppointments() {
  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ["appointment", "list", "incoming"],
    queryFn: async () => {
      const { data, error } = await getIncomingAppointments();

      if (error) return Promise.reject(error);

      return data;
    },
  });

  const t = useTranslations(
    "features.appointments.admin-incoming-appointments",
  );

  return {
    data,
    isLoading,
    isError,
    refetch,
    isRefetching,
    t,
  };
}
