"use client";

import { LoaderIcon } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

import { useNotificationsSidebar } from "@/features/notifications/hooks/use-notifications-sidebar";
import { NotificationsSidebarSkeleton } from "@/features/notifications/components/notifications-sidebar-skeleton";
import { NotificationPreview } from "@/features/notifications/components/notification-preview";

export const NotificationsSidebar = () => {
  const { data, isLoading, isError, refetch, isRefetching, t } =
    useNotificationsSidebar();

  if (isLoading) return <NotificationsSidebarSkeleton />;

  if (isError)
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        {t("error-message")}
        <Button
          disabled={isRefetching}
          variant="destructive"
          onClick={() => refetch()}
        >
          {isRefetching && <LoaderIcon className="animate-spin" />}
          {t("refetch-button")}
        </Button>
      </div>
    );

  if (!data || data.length === 0)
    return (
      <div className="flex flex-col items-center pt-4">
        {t("empty-message")}
      </div>
    );

  return (
    <ScrollArea className="h-full min-w-72">
      <div className="flex flex-col gap-2">
        {data.map((notification) => (
          <NotificationPreview
            key={notification.id}
            notification={notification}
          />
        ))}
      </div>
    </ScrollArea>
  );
};
