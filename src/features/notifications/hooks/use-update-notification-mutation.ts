import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateNotificationStatus } from "@/features/notifications/actions/update-notification";
import type { UpdateNotificationVariables } from "@/features/notifications/schemas/update-notification";
import type { Notification } from "@/features/notifications/types/notification";

export function useUpdateNotificationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: UpdateNotificationVariables) => {
      const result = await updateNotificationStatus(variables);

      if (result.error) {
        return Promise.reject(result.error);
      }

      return result.data;
    },
    onMutate: async ({ id, read }) => {
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
            notif.id === id ? { ...notif, read } : notif,
          ),
        });
      }

      const targetNotif = previousNotifications?.data?.find(
        (notif) => notif.id === id,
      );
      if (targetNotif && previousUnreadCount) {
        const wasUnread = !targetNotif.read;
        const willBeUnread = !read;

        let countChange = 0;
        if (wasUnread && !willBeUnread) countChange = -1;
        if (!wasUnread && willBeUnread) countChange = 1;

        if (countChange !== 0) {
          queryClient.setQueryData(["notifications", "unread-count"], {
            ...previousUnreadCount,
            data: Math.max(0, previousUnreadCount.data + countChange),
          });
        }
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

      console.error("Error updating notification:", error);
      toast.error("Error al actualizar notificación", {
        description:
          "No se pudo actualizar la notificación. Inténtalo de nuevo.",
      });
    },
    onSuccess: (data, variables) => {
      if (!variables.read) {
        toast.success("Notificación actualizada");
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications", { limit: 99, offset: 0 }],
      });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
    },
  });
}
