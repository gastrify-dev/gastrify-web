import { useQuery } from "@tanstack/react-query";
import { Notification } from "../types";

async function fetchNotifications(locale: string): Promise<Notification[]> {
  const res = await fetch(`/api/notifications?locale=${locale}`);
  if (!res.ok) throw new Error("Error fetching notifications");
  return res.json();
}

export function useNotifications(locale: string = "es") {
  const {
    data: notifications = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Notification[]>({
    queryKey: ["notifications", locale],
    queryFn: () => fetchNotifications(locale),
  });

  return { notifications, isLoading, error, refetch };
}
