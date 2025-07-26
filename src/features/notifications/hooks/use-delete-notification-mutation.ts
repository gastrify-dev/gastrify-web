import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { deleteNotification } from "@/features/notifications/actions/delete-notification";
import type {
  Notification,
  DeleteNotificationVariables,
} from "@/features/notifications/types";

export function useDeleteNotificationMutation() {
  const queryClient = useQueryClient();

  const t = useTranslations(
    "features.notifications.use-delete-notification-mutation",
  );

  return useMutation({
    mutationFn: async (variables: DeleteNotificationVariables) => {
      const { error } = await deleteNotification(variables);

      if (error) return Promise.reject(error);
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["notification", "list"] });
      await queryClient.cancelQueries({
        queryKey: ["notification", "details", variables.id],
      });

      const previousNotifications = queryClient.getQueryData<Notification[]>([
        "notification",
        "list",
      ]);

      queryClient.setQueryData<Notification[]>(
        ["notification", "list"],
        (old) =>
          old?.filter((notification) => notification.id !== variables.id),
      );

      const previousNotification = queryClient.getQueryData<Notification>([
        "notification",
        "details",
        variables.id,
      ]);

      queryClient.removeQueries({
        queryKey: ["notification", "details", variables.id],
      });

      return { previousNotifications, previousNotification };
    },
    onError: (_error, variables, context) => {
      queryClient.setQueryData<Notification[]>(
        ["notification", "list"],
        context?.previousNotifications,
      );

      queryClient.setQueryData<Notification>(
        ["notification", "details", variables.id],
        context?.previousNotification,
      );

      toast.error(t("error-toast"), {
        description: t("error-toast-description"),
      });
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["notification", "list"] });
      queryClient.invalidateQueries({
        queryKey: ["notification", "details", variables.id],
      });
    },
  });
}
