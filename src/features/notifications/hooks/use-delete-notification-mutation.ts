import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { deleteNotification } from "@/features/notifications/actions/delete-notification";
import type { DeleteNotificationVariables } from "@/features/notifications/schemas/delete-notification";
import type { Notification } from "@/features/notifications/types/notification";

export function useDeleteNotificationMutation() {
  const queryClient = useQueryClient();

  const t = useTranslations("features.notifications");

  return useMutation({
    mutationFn: async (variables: DeleteNotificationVariables) => {
      const { error } = await deleteNotification(variables);

      if (error) return Promise.reject(error);
    },
    onMutate: async (variables) => {
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
          data: previousNotifications.data.filter(
            (notification) => notification.id !== variables.id,
          ),
        });
      }

      const deletedNotification = previousNotifications?.data?.find(
        (notification) => notification.id === variables.id,
      );
      if (
        deletedNotification &&
        !deletedNotification.read &&
        previousUnreadCount
      ) {
        queryClient.setQueryData(["notifications", "unread-count"], {
          ...previousUnreadCount,
          data: Math.max(0, previousUnreadCount.data - 1),
        });
      }

      return { previousNotifications, previousUnreadCount };
    },
    onError: (_error, _variables, context) => {
      const activeKey = ["notifications", { limit: 99, offset: 0 }];
      if (context?.previousNotifications) {
        queryClient.setQueryData(activeKey, context.previousNotifications);
      }
      if (context?.previousUnreadCount) {
        queryClient.setQueryData(
          ["notifications", "unread-count"],
          context.previousUnreadCount,
        );
      }

      toast.error(t("use-delete-notification-mutation.error-toast"), {
        description: t(
          "use-delete-notification-mutation.error-toast-description",
        ),
      });
    },
    onSettled: () => {
      const activeKey = ["notifications", { limit: 99, offset: 0 }];
      queryClient.invalidateQueries({ queryKey: activeKey });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
    },
  });
}
