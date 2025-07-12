import { useLocale } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/hooks/use-session";

type Notification = {
  id: string;
  [key: string]: unknown;
};

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  const locale = useLocale();
  const { data } = useSession();
  const userId = data?.user?.id;
  return useMutation({
    mutationFn: async (id: string) => {
      queryClient.setQueryData(
        ["notifications", locale],
        (old: Notification[] | undefined) => {
          if (!old) return old;
          return old.filter(
            (notification: Notification) => notification.id !== id,
          );
        },
      );
      queryClient.setQueryData(
        ["notifications", "unread-count", userId],
        (old: number | undefined) => {
          if (typeof old === "number") return Math.max(0, old - 1);
          return old;
        },
      );
      const res = await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error deleting notification");
      return res.json();
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", locale] });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count", userId],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", locale] });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count", userId],
      });
    },
  });
}
