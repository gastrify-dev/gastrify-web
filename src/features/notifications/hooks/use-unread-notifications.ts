import { useQuery } from "@tanstack/react-query";

import { getUnreadNotificationsCount } from "../actions/get-unread-notifications-count";
import type { NotificationErrorCode } from "../types/notification";

export function useUnreadNotifications() {
  return useQuery<{ data: number; error: NotificationErrorCode | null }>({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      const result = await getUnreadNotificationsCount();
      if (result.error) {
        return { data: 0, error: result.error.code ?? result.error };
      }
      return { data: result.data ?? 0, error: null };
    },
    refetchInterval: 5000,
    staleTime: 5000,
  });
}
