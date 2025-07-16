"use client";
import React from "react";
import { useNotifications } from "../hooks/use-notifications";
import { useDeleteNotificationMutation } from "../hooks/use-delete-notification-mutation";
import { useMarkNotificationAsReadMutation } from "../hooks/use-mark-notification-as-read-mutation";
import type { Notification as AppNotification } from "../types";
import { useSession } from "@/shared/hooks/use-session";
import { NotificationList } from "./notification-list";
import NotificationContent from "./notification-content";
import NotificationSkeleton from "./notification-skeleton";
import { useTranslations } from "next-intl";

const NotificationsClient: React.FC = () => {
  const { data: session } = useSession();
  const t = useTranslations("features.notifications");
  const userId = session?.user?.id;
  const notificationsQuery = useNotifications({ limit: 20, offset: 0 });

  React.useEffect(() => {
    const handler = () => {
      notificationsQuery.refetch();
    };
    window.addEventListener("notification-created", handler);
    // Also listen to storage events for multi-tab support
    const storageHandler = (e: StorageEvent) => {
      if (e.key === "notification-created") {
        notificationsQuery.refetch();
      }
    };
    window.addEventListener("storage", storageHandler);
    return () => {
      window.removeEventListener("notification-created", handler);
      window.removeEventListener("storage", storageHandler);
    };
  }, [notificationsQuery]);

  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [deletingIds, setDeletingIds] = React.useState<Set<string>>(new Set());
  const notifications = React.useMemo(
    () => notificationsQuery.data?.data ?? [],
    [notificationsQuery.data],
  );
  const selected =
    notifications.find((n: AppNotification) => n.id === selectedId) || null;

  const { mutate: markAsRead } = useMarkNotificationAsReadMutation();
  const { mutate: deleteNotification } = useDeleteNotificationMutation();

  const handleSelect = (n: AppNotification) => {
    setSelectedId(n.id);
    if (!n.read && userId) {
      markAsRead({ notificationId: n.id, userId });
    }
  };

  const handleDelete = (id: string) => {
    setDeletingIds((prev) => new Set(prev).add(id));
    if (userId) {
      deleteNotification(
        { notificationId: id, userId },
        {
          onSettled: () => {
            setSelectedId((prev) => (prev === id ? null : prev));
          },
        },
      );
    }
  };

  React.useEffect(() => {
    setDeletingIds((prev) => {
      const newSet = new Set(prev);
      for (const id of prev) {
        if (!notifications.some((n: AppNotification) => n.id === id)) {
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
          {selectedId && selected ? (
            <NotificationContent
              notification={selected}
              clearSelection={() => setSelectedId(null)}
              onDelete={handleDelete}
              isDeleting={selected ? deletingIds.has(selected.id) : false}
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

export default NotificationsClient;
