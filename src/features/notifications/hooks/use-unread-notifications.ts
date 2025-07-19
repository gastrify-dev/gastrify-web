import { useQuery } from "@tanstack/react-query";

import { getUnreadNotificationsCount } from "@/features/notifications/actions/get-unread-notifications-count";

export function useUnreadNotifications() {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      const result = await getUnreadNotificationsCount();

      if (result.error) {
        throw new Error(result.error.message || "Failed to fetch unread count");
      }

      return { data: result.data ?? 0, error: null };
    },
    refetchInterval: 5000,
    staleTime: 5000,
    retry: (failureCount, error) => {
      if (failureCount >= 3) return false;
      if (error.message?.includes("UNAUTHORIZED")) return false;
      return true;
    },
  });
}
