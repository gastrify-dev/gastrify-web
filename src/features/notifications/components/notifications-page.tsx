"use client";

import React, { useState } from "react";

import { useNotifications } from "@/features/notifications/hooks/use-notifications";
import { useDeleteNotificationMutation } from "@/features/notifications/hooks/use-delete-notification-mutation";
import { NotificationList } from "@/features/notifications/components/notification-list";
import NotificationContent from "@/features/notifications/components/notification-content";

export const NotificationsPage: React.FC = () => {
  const { data, isLoading, error } = useNotifications({ limit: 99, offset: 0 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const notifications = data?.data ?? [];
  const selectedNotification =
    notifications.find((n) => n.id === selectedId) ?? null;
  const deleteMutation = useDeleteNotificationMutation();

  return (
    <div className="flex h-full">
      <div className="w-1/2 border-r">
        <NotificationList
          notifications={notifications}
          loading={!!isLoading}
          error={error?.message ?? null}
          onSelect={(n) => setSelectedId(n.id)}
          selectedId={selectedId ?? undefined}
        />
      </div>
      <div className="w-1/2">
        {selectedNotification && (
          <NotificationContent
            notification={selectedNotification}
            onDelete={(id) => {
              if (selectedNotification.userId) {
                deleteMutation.mutate({
                  id: id,
                });
              }
            }}
          />
        )}
      </div>
    </div>
  );
};
