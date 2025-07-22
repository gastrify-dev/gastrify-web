import { useLocale, useTranslations } from "next-intl";

import { useDeleteNotificationMutation } from "@/features/notifications/hooks/use-delete-notification-mutation";
import type { Notification } from "@/features/notifications/types";

export function useNotification(
  notification: Notification,
  clearSelection?: () => void,
  onDelete?: (id: string) => void,
) {
  const locale = useLocale();
  const t = useTranslations("features.notifications");
  const { mutate: deleteNotification, status } =
    useDeleteNotificationMutation();

  const handleDelete = () => {
    if (clearSelection) clearSelection();
    if (onDelete) {
      onDelete(notification.id);
    } else {
      deleteNotification({ id: notification.id });
    }
  };

  return {
    locale,
    t,
    status,
    handleDelete,
  };
}
