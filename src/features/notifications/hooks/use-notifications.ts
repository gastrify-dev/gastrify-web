import { useQuery } from "@tanstack/react-query";

import { getNotifications } from "@/features/notifications/actions/get-notifications";
import { GetNotificationsVariables } from "@/features/notifications/schemas/get-notifications";

export function useNotifications(variables: GetNotificationsVariables) {
  return useQuery({
    queryKey: ["notifications", variables],
    queryFn: async ({ queryKey }) => {
      const [, vars] = queryKey as [string, GetNotificationsVariables];
      const result = await getNotifications(vars);

      if (result.error) {
        throw new Error(
          result.error.message || "Failed to fetch notifications",
        );
      }

      return {
        data: result.data ?? [],
        error: null,
      };
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    refetchInterval: 5000,
    retry: (failureCount, error) => {
      if (failureCount >= 3) return false;
      if (error.message?.includes("UNAUTHORIZED")) return false;
      return true;
    },
  });
}
