import { useQuery } from "@tanstack/react-query";

export function useUnreadNotifications() {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      const res = await fetch("/api/notifications/unread-count");
      if (!res.ok) throw new Error("Error fetching unread notifications count");
      const data = await res.json();
      return data.count as number;
    },
    refetchInterval: 10000,
  });
}
