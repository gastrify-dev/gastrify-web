// Importaciones de terceros
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Importaciones shared
import { deleteNotification } from "../actions/delete-notification";
import type { Notification } from "../types/notification";
//import type { NotificationErrorCode } from "../types/notification";

// Implementación propia

export function useDeleteNotificationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: { notificationId: string; userId: string }) =>
      await deleteNotification(variables.notificationId, variables.userId),
    onMutate: async ({ notificationId }) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      await queryClient.cancelQueries({
        queryKey: ["notifications", "unread-count"],
      });

      const previousNotifications = queryClient.getQueryData<{
        data: Notification[];
      }>(["notifications"]);
      const previousUnreadCount = queryClient.getQueryData<{ data: number }>([
        "notifications",
        "unread-count",
      ]);

      // Optimistically remove notification
      if (previousNotifications?.data) {
        queryClient.setQueryData(["notifications"], {
          ...previousNotifications,
          data: previousNotifications.data.filter(
            (notif) => notif.id !== notificationId,
          ),
        });
      }

      // If the notification was unread, optimistically decrement unread count
      const deletedNotif = previousNotifications?.data?.find(
        (notif) => notif.id === notificationId,
      );
      if (deletedNotif && !deletedNotif.read && previousUnreadCount) {
        queryClient.setQueryData(["notifications", "unread-count"], {
          ...previousUnreadCount,
          data: Math.max(0, previousUnreadCount.data - 1),
        });
      }

      return { previousNotifications, previousUnreadCount };
    },
    onError: (_err, _vars, context) => {
      // Rollback
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ["notifications"],
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
