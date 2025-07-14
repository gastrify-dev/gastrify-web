"use client";
import React from "react";

import { NotificationList } from "./notification-list";
import NotificationContent from "./notification-content";
import NotificationEmpty from "./notification-empty";
import NotificationSkeleton from "./notification-skeleton";
import { useNotifications } from "../hooks/use-notifications";
import { useDeleteNotification } from "../hooks/use-delete-notification";
import type { Notification as AppNotification } from "../types";
import { useTranslations, useLocale } from "next-intl";
import { useSession } from "@/shared/hooks/use-session";

export default function NotificationsClient() {
  const locale = useLocale();
  const t = useTranslations("features.notifications");
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const notificationsQuery = useNotifications(userId, locale as "en" | "es");

  React.useEffect(() => {
    const handler = () => {
      notificationsQuery.refetch();
    };
    window.addEventListener("notification-created", handler);
    return () => window.removeEventListener("notification-created", handler);
  }, [notificationsQuery]);

  const notifications = notificationsQuery.notifications as AppNotification[];

  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const selected =
    notifications.find((n: AppNotification) => n.id === selectedId) || null;
  React.useEffect(() => {
    if (selectedId && !selected) {
      setSelectedId(null);
    }
  }, [notifications, selectedId, selected]);
  const handleSelect = (n: AppNotification) => {
    setSelectedId(n.id);
    // Si quieres marcar como leída, deberías hacerlo vía una mutación, no solo en el estado local
  };

  const { mutate: deleteNotification } = useDeleteNotification();
  const handleDelete = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : prev));
    deleteNotification(id);
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex flex-1 flex-col gap-2 md:flex-row">
        <section className="h-64 w-full overflow-y-auto border-r md:h-full md:w-1/2">
          {notificationsQuery.isLoading ? (
            <NotificationSkeleton />
          ) : notificationsQuery.error ? (
            <div className="p-8 text-red-500">{t("error")}</div>
          ) : notificationsQuery.notifications &&
            notificationsQuery.notifications.length > 0 ? (
            <NotificationList
              notifications={notifications as AppNotification[]}
              selectedId={selected?.id}
              onSelect={handleSelect}
            />
          ) : (
            <NotificationEmpty />
          )}
        </section>
        <section className="h-full w-full flex-1 overflow-y-auto">
          {selectedId && selected ? (
            <NotificationContent
              notification={selected as AppNotification}
              clearSelection={() => {
                setSelectedId(null);
              }}
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
}
