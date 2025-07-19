"use client";

import React from "react";
import { formatNotificationDate } from "@/features/notifications/utils/format-notification-date";
import { getDateFnsLocale } from "@/features/notifications/utils/get-date-fns-locale";
import { useLocale, useTranslations } from "next-intl";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";

import { useDeleteNotificationMutation } from "@/features/notifications/hooks/use-delete-notification-mutation";
import type { Notification } from "@/features/notifications/types";

type Props = {
  notification: Notification;
  clearSelection?: () => void;
  onDelete?: (id: string) => void;
};

export default function NotificationContent({
  notification,
  clearSelection,
  onDelete,
}: Props) {
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
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle className="mb-2 text-xl font-semibold">
            {notification.title}
          </CardTitle>
          <div className="text-muted-foreground text-sm">
            {formatNotificationDate(
              notification.createdAt,
              getDateFnsLocale(locale),
            )}
          </div>
        </CardHeader>
        <CardContent>
          <article
            className="flex-1 overflow-y-auto break-words whitespace-pre-line"
            style={{ minHeight: 120 }}
          >
            {notification.content}
          </article>
        </CardContent>
        <CardFooter className="mt-4 flex gap-2">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={status === "pending"}
          >
            {status === "pending" ? t("content.deleting") : t("content.delete")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
