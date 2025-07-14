import { useQuery } from "@tanstack/react-query";
import { Notification } from "../types";
import { fetchNotificationList } from "../actions/client";

export function useNotifications(
  userId: string | undefined,
  locale: string = "es",
) {
  const {
    data: notifications = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Notification[]>({
    queryKey: ["notifications", userId, locale],
    queryFn: () =>
      userId ? fetchNotificationList(userId, locale) : Promise.resolve([]),
    enabled: !!userId,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  return { notifications, isLoading, error, refetch };
}
