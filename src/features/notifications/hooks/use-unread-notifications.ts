import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/hooks/use-session";

export function useUnreadNotifications() {
  const { data } = useSession();
  const userId = data?.user?.id;

  const { data: unreadCount } = useQuery({
    queryKey: ["notifications", "unread-count", userId],
    queryFn: async () => {
      if (!userId) return 0;
      const res = await fetch(
        `/api/notifications/unread-count?userId=${userId}`,
      );
      if (!res.ok)
        throw new Error("Failed to fetch unread notifications count");
      const json = await res.json();
      return json.count ?? 0;
    },
    enabled: !!userId,
    staleTime: 60_000, // 1 min
  });

  return unreadCount ?? 0;
}
