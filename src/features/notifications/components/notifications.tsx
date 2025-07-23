"use client";

import { LoaderIcon } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { useNotifications } from "@/features/notifications/hooks/use-notifications";
import NotificationContent from "@/features/notifications/components/notification-detail";
import NotificationSkeleton from "@/features/notifications/components/notification-skeleton";
import { NotificationItem } from "@/features/notifications/components/notification";
import type { Notification } from "@/features/notifications/types";

const Notifications = () => {
  const {
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
  } = useNotifications();

  if (isLoading) return <NotificationSkeleton />;

  if (isError)
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        {t("error")}
        <Button
          disabled={isRefetching}
          variant="destructive"
          onClick={() => refetch()}
        >
          {isRefetching && <LoaderIcon className="animate-spin" />}
          {t("refetch")}
        </Button>
      </div>
    );

  if (!notifications || notifications.length === 0)
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        {t("empty")}
      </div>
    );

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex flex-1 flex-col gap-2 md:flex-row">
        <section className="flex w-full flex-col border-r md:h-full md:w-1/2">
          <ScrollArea
            className="max-h-[calc(100vh-10rem)] min-h-[320px] flex-1"
            style={{ minHeight: 320, maxHeight: "calc(100vh - 10rem)" }}
          >
            <ul
              className="divide-y"
              role="listbox"
              aria-label="Lista de notificaciones"
              tabIndex={0}
            >
              {notifications.map((n: Notification, idx: number) => (
                <li
                  key={`notif-${n.id}`}
                  role="option"
                  aria-selected={n.id === selected?.id}
                >
                  <NotificationItem
                    notification={n}
                    selected={n.id === selected?.id}
                    onClick={() => {
                      if (deletingIds.has(n.id)) return;
                      handleSelect(n);
                    }}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (deletingIds.has(n.id)) return;
                      if (e.key === "Enter" || e.key === " ") handleSelect(n);
                      if (e.key === "ArrowDown") {
                        const next = document.querySelector(
                          `[data-notification-idx='${idx + 1}']`,
                        );
                        if (next) (next as HTMLElement).focus();
                      }
                      if (e.key === "ArrowUp") {
                        const prev = document.querySelector(
                          `[data-notification-idx='${idx - 1}']`,
                        );
                        if (prev) (prev as HTMLElement).focus();
                      }
                    }}
                    data-notification-idx={idx}
                  />
                </li>
              ))}
            </ul>
          </ScrollArea>
        </section>
        <section className="h-full w-full flex-1 overflow-y-auto">
          {selectedId &&
          selected &&
          notifications.some((n: Notification) => n.id === selectedId) ? (
            <NotificationContent
              notification={selected}
              clearSelection={clearSelection}
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
