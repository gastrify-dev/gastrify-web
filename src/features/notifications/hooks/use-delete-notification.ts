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
      const res = await fetch("/actions/notifications/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id, userId }),
      });
      if (!res.ok) throw new Error("Error deleting notification");
      return res.json();
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({
        queryKey: ["notifications", userId, locale],
      });
      const previousNotifications = queryClient.getQueryData<Notification[]>([
        "notifications",
        userId,
        locale,
      ]);
      queryClient.setQueryData(
        ["notifications", userId, locale],
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
      return { previousNotifications };
    },
    onError: (err, variables, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ["notifications", userId, locale],
          context.previousNotifications,
        );
      }
      queryClient.invalidateQueries({
        queryKey: ["notifications", userId, locale],
      });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count", userId],
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications", userId, locale],
      });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count", userId],
      });
    },
  });
}
