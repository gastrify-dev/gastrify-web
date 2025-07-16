import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNotificationStatus } from "../actions/update-notification";

interface MarkAsReadArgs {
  notificationId: string;
  userId: string;
}

export function useMarkNotificationAsReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ notificationId, userId }: MarkAsReadArgs) => {
      return await updateNotificationStatus(notificationId, userId, true);
    },
    onMutate: async ({ notificationId }) => {
      // Solo cancelar y actualizar la key activa de notificaciones y el contador
      const activeKey = ["notifications", { limit: 20, offset: 0 }];
      await queryClient.cancelQueries({ queryKey: activeKey });
      await queryClient.cancelQueries({
        queryKey: ["notifications", "unread-count"],
      });

      const previousNotifications = queryClient.getQueryData<{
        data: import("../types").Notification[];
      }>(activeKey);
      const previousUnreadCount = queryClient.getQueryData<{ data: number }>([
        "notifications",
        "unread-count",
      ]);

      if (previousNotifications?.data) {
        queryClient.setQueryData(activeKey, {
          ...previousNotifications,
          data: previousNotifications.data.map((notif) =>
            notif.id === notificationId ? { ...notif, read: true } : notif,
          ),
        });
      }

      if (previousUnreadCount) {
        queryClient.setQueryData(["notifications", "unread-count"], {
          ...previousUnreadCount,
          data: Math.max(0, previousUnreadCount.data - 1),
        });
      }

      return { previousNotifications, previousUnreadCount };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ["notifications", { limit: 20, offset: 0 }],
          context.previousNotifications,
        );
      }
      if (context?.previousUnreadCount) {
        queryClient.setQueryData(
          ["notifications", "unread-count"],
          context.previousUnreadCount,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
    },
  });
}
