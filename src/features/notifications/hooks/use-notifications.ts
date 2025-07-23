import { useState, useMemo, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { useSession } from "@/shared/hooks/use-session";
import { getNotifications } from "@/features/notifications/actions/get-notifications";
import { Notification } from "@/features/notifications/types";
import { useDeleteNotificationMutation } from "@/features/notifications/hooks/use-delete-notification-mutation";
import { useMarkNotificationAsReadMutation } from "@/features/notifications/hooks/use-mark-notification-as-read-mutation";
import { useOptimisticNotifications } from "@/features/notifications/hooks/use-optimistic-notifications";

export function useNotifications() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { addOptimisticNotification } = useOptimisticNotifications();

  const notificationsKey = ["notifications", { limit: 99, offset: 0 }];
  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: notificationsKey,
    queryFn: async () => {
      const { data, error } = await getNotifications({ limit: 99, offset: 0 });
      if (error) return Promise.reject(error);
      return { data };
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    refetchInterval: 5000,
    retry: (failureCount, error) => {
      if (failureCount >= 3) return false;
      if (error.message?.includes("UNAUTHORIZED")) return false;
      return true;
    },
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const notifications = useMemo(() => data?.data || [], [data]);
  const selected =
    notifications.find(
      (notification: Notification) => notification.id === selectedId,
    ) || null;

  const { mutate: markAsRead } = useMarkNotificationAsReadMutation();
  const { mutate: deleteNotification } = useDeleteNotificationMutation();

  const handleSelect = useCallback(
    (notification: Notification) => {
      setSelectedId(notification.id);

      if (!notification.read && userId) {
        markAsRead({ id: notification.id });
      }
    },
    [userId, markAsRead],
  );

  const handleDelete = useCallback(
    (id: string) => {
      setDeletingIds((prev) => new Set(prev).add(id));
      setSelectedId((prev) => (prev === id ? null : prev));
      if (userId) {
        deleteNotification({ id });
      }
    },
    [userId, deleteNotification],
  );

  const clearSelection = useCallback(() => {
    setSelectedId(null);
  }, []);

  useEffect(() => {
    const handler = (event: CustomEvent) => {
      if (event.detail?.notification) {
        addOptimisticNotification(event.detail.notification);
      } else {
        refetch();
      }
    };

    window.addEventListener("notification-created", handler as EventListener);

    const storageHandler = (e: StorageEvent) => {
      if (e.key === "notification-created") {
        try {
          const notificationData = e.newValue ? JSON.parse(e.newValue) : null;
          if (notificationData) {
            addOptimisticNotification(notificationData);
          } else {
            refetch();
          }
        } catch {
          refetch();
        }
      }
    };

    window.addEventListener("storage", storageHandler);

    return () => {
      window.removeEventListener(
        "notification-created",
        handler as EventListener,
      );
      window.removeEventListener("storage", storageHandler);
    };
  }, [refetch, addOptimisticNotification]);

  useEffect(() => {
    setDeletingIds((prev) => {
      const newSet = new Set(prev);
      for (const id of prev) {
        if (
          !notifications.some(
            (notification: Notification) => notification.id === id,
          )
        ) {
          newSet.delete(id);
        }
      }
      return newSet;
    });
  }, [notifications]);

  const t = useTranslations("features.notifications");

  return {
    data,
    notifications,
    selected,
    selectedId,
    deletingIds,

    isLoading,
    isError,
    refetch,
    isRefetching,

    handleSelect,
    handleDelete,
    clearSelection,

    t,
  };
}
