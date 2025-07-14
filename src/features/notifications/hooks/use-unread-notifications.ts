import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/hooks/use-session";
import { fetchUnreadNotificationCount } from "@/features/notifications/actions/client";
import React from "react";

export function useUnreadNotifications() {
  const { data } = useSession();
  const userId = data?.user?.id;

  const { data: unreadCount, refetch } = useQuery({
    queryKey: ["notifications", "unread-count", userId],
    queryFn: async () => {
      if (!userId) return 0;
      return await fetchUnreadNotificationCount(userId);
    },
    enabled: !!userId,
    staleTime: 0,
  });

  React.useEffect(() => {
    const handler = () => {
      refetch();
    };
    window.addEventListener("notification-created", handler);
    return () => window.removeEventListener("notification-created", handler);
  }, [refetch]);

  return unreadCount ?? 0;
}
