"use client";
import React from "react";
import { useTranslations } from "next-intl";

import { useSession } from "@/shared/hooks/use-session";

import { useNotifications } from "@/features/notifications/hooks/use-notifications";
import { useDeleteNotificationMutation } from "@/features/notifications/hooks/use-delete-notification-mutation";
import { useMarkNotificationAsReadMutation } from "@/features/notifications/hooks/use-mark-notification-as-read-mutation";
import { useOptimisticNotifications } from "@/features/notifications/hooks/use-optimistic-notifications";
import { NotificationList } from "@/features/notifications/components/notification-list";
import NotificationContent from "@/features/notifications/components/notification-content";
import NotificationSkeleton from "@/features/notifications/components/notification-skeleton";
import type { Notification as AppNotification } from "@/features/notifications/types";

const Notifications: React.FC = () => {
  const { data: session } = useSession();
  const t = useTranslations("features.notifications");
  const userId = session?.user?.id;
  const notificationsQuery = useNotifications({ limit: 99, offset: 0 });
  const { addOptimisticNotification } = useOptimisticNotifications();

  React.useEffect(() => {
    const handler = (event: CustomEvent) => {
      if (event.detail?.notification) {
        addOptimisticNotification(event.detail.notification);
      } else {
        notificationsQuery.refetch();
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
            notificationsQuery.refetch();
          }
        } catch {
          notificationsQuery.refetch();
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
  }, [notificationsQuery, addOptimisticNotification]);

  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [deletingIds, setDeletingIds] = React.useState<Set<string>>(new Set());
  const notifications = React.useMemo(
    () => notificationsQuery.data?.data ?? [],
    [notificationsQuery.data],
  );
  const selected =
    notifications.find(
      (notification: AppNotification) => notification.id === selectedId,
    ) || null;

  const { mutate: markAsRead } = useMarkNotificationAsReadMutation();
  const { mutate: deleteNotification } = useDeleteNotificationMutation();

  const handleSelect = (notification: AppNotification) => {
    setSelectedId(notification.id);
    if (!notification.read && userId) {
      markAsRead({ id: notification.id });
    }
  };

  const handleDelete = (id: string) => {
    setDeletingIds((prev) => new Set(prev).add(id));
    setSelectedId((prev) => (prev === id ? null : prev));
    if (userId) {
      deleteNotification({ id });
    }
  };

  React.useEffect(() => {
    setDeletingIds((prev) => {
      const newSet = new Set(prev);
      for (const id of prev) {
        if (
          !notifications.some(
            (notification: AppNotification) => notification.id === id,
          )
        ) {
          newSet.delete(id);
        }
      }
      return newSet;
    });
  }, [notifications]);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex flex-1 flex-col gap-2 md:flex-row">
        <section className="flex w-full flex-col border-r md:h-full md:w-1/2">
          <div
            className="max-h-[calc(100vh-10rem)] min-h-[320px] flex-1 overflow-y-auto"
            style={{ minHeight: 320, maxHeight: "calc(100vh - 10rem)" }}
          >
            {notificationsQuery.isLoading ? (
              <NotificationSkeleton />
            ) : notificationsQuery.error ? (
              <div className="p-8 text-red-500">
                Error al cargar notificaciones
              </div>
            ) : (
              <NotificationList
                notifications={notifications}
                selectedId={selected?.id ?? undefined}
                onSelect={handleSelect}
                deletingIds={deletingIds}
                loading={notificationsQuery.isLoading}
                error={notificationsQuery.error as string | null}
              />
            )}
          </div>
        </section>
        <section className="h-full w-full flex-1 overflow-y-auto">
          {selectedId &&
          selected &&
          notifications.some((n) => n.id === selectedId) ? (
            <NotificationContent
              notification={selected}
              clearSelection={() => setSelectedId(null)}
              onDelete={handleDelete}
            />
          ) : (
            <div className="text-muted-foreground flex h-full items-center justify-center">
              {t("select")}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Notifications;
