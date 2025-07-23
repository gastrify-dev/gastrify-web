"use client";

import React from "react";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/shared/components/ui/card";

import { useNotification } from "@/features/notifications/hooks/use-notification";
import { formatNotificationDate } from "@/features/notifications/utils/format-notification-date";
import { getDateFnsLocale } from "@/features/notifications/utils/get-date-fns-locale";
import type { Notification } from "@/features/notifications/types";

type Props = {
  notification: Notification;
  clearSelection?: () => void;
  onDelete?: (id: string) => void;
};

export default function NotificationDetail({
  notification,
  clearSelection,
  onDelete,
}: Props) {
  const { locale, t, status, handleDelete } = useNotification(
    notification,
    clearSelection,
    onDelete,
  );
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
