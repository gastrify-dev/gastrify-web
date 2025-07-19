import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateNotificationStatus } from "@/features/notifications/actions/update-notification";
import type { UpdateNotificationVariables } from "@/features/notifications/schemas/update-notification";
import type { Notification } from "@/features/notifications/types/notification";

export function useMarkNotificationAsReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: Pick<UpdateNotificationVariables, "id">) => {
      const result = await updateNotificationStatus({
        ...variables,
        read: true,
      });

      if (result.error) {
        return Promise.reject(result.error);
      }

      return result.data;
    },
    onMutate: async ({ id }) => {
      const activeKey = ["notifications", { limit: 99, offset: 0 }];
      await queryClient.cancelQueries({ queryKey: activeKey });
      await queryClient.cancelQueries({
        queryKey: ["notifications", "unread-count"],
      });

      const previousNotifications = queryClient.getQueryData<{
        data: Notification[];
      }>(activeKey);
      const previousUnreadCount = queryClient.getQueryData<{ data: number }>([
        "notifications",
        "unread-count",
      ]);

      if (previousNotifications?.data) {
        queryClient.setQueryData(activeKey, {
          ...previousNotifications,
          data: previousNotifications.data.map((notif) =>
            notif.id === id ? { ...notif, read: true } : notif,
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
    onError: (error, _vars, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ["notifications", { limit: 99, offset: 0 }],
          context.previousNotifications,
        );
      }
      if (context?.previousUnreadCount) {
        queryClient.setQueryData(
          ["notifications", "unread-count"],
          context.previousUnreadCount,
        );
      }

      console.error("Error marking notification as read:", error);
      toast.error("Error al marcar como leída", {
        description:
          "No se pudo marcar la notificación como leída. Inténtalo de nuevo.",
      });
    },
    onSuccess: () => {},
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
    },
  });
}
