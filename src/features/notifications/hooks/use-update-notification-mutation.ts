import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { updateNotification } from "@/features/notifications/actions/update-notification";
import type {
  UpdateNotificationVariables,
  Notification,
} from "@/features/notifications/types";

export function useUpdateNotificationMutation() {
  const queryClient = useQueryClient();

  const t = useTranslations(
    "features.notifications.use-update-notification-mutation",
  );

  return useMutation({
    mutationFn: async (variables: UpdateNotificationVariables) => {
      const { data, error } = await updateNotification(variables);

      if (error) return Promise.reject(error);

      return data;
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["notification", "list"] });

      const previousNotifications = queryClient.getQueryData<Notification[]>([
        "notification",
        "list",
      ]);

      queryClient.setQueryData(
        ["notification", "list"],
        previousNotifications?.map((notification) =>
          notification.id === variables.id
            ? { ...notification, read: true }
            : notification,
        ),
      );

      return { previousNotifications };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(
        ["notification", "list"],
        context?.previousNotifications,
      );

      toast.error(t("error-toast"), {
        description: t("error-toast-description"),
      });
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["notification", "list"],
      });
      queryClient.invalidateQueries({
        queryKey: ["notification", "details", variables.id],
      });
    },
  });
}
