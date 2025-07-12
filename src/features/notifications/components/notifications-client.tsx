"use client";

import { NotificationList } from "./notification-list";
import NotificationContent from "./notification-content";
import NotificationEmpty from "./notification-empty";
import NotificationSkeleton from "./notification-skeleton";
import { useNotifications } from "../hooks/use-notifications";
import { useNotificationDetail } from "../hooks/use-notification-detail";
import { useTranslations, useLocale } from "next-intl";

export default function NotificationsClient() {
  const locale = useLocale();
  const t = useTranslations("features.notifications");
  const notificationsQuery = useNotifications(locale as "en" | "es");
  const { selected, setSelectedId } = useNotificationDetail(
    notificationsQuery.notifications,
  );

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
              notifications={notificationsQuery.notifications}
              selectedId={selected?.id}
              onSelect={(
                n: (typeof notificationsQuery.notifications)[number],
              ) => setSelectedId(n.id)}
            />
          ) : (
            <NotificationEmpty />
          )}
        </section>
        <section className="h-full w-full flex-1 overflow-y-auto">
          {selected ? (
            <NotificationContent notification={selected} />
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
