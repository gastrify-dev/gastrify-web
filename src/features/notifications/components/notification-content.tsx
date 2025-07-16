"use client";

import { useLocale, useTranslations } from "next-intl";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";

import { Notification } from "../types";
import { useDeleteNotificationMutation } from "../hooks/use-delete-notification-mutation";

type Props = {
  notification: Notification;
  clearSelection?: () => void;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
};

export default function NotificationContent({
  notification,
  clearSelection,
  onDelete,
  isDeleting = false,
}: Props) {
  const locale = useLocale();
  const t = useTranslations("features.notifications");
  const deleteNotif = useDeleteNotificationMutation();

  const handleDelete = () => {
    if (isDeleting) return;

    if (onDelete) {
      onDelete(notification.id);
      if (clearSelection) clearSelection();
    } else {
      deleteNotif.mutate(
        { notificationId: notification.id, userId: notification.userId },
        {
          onSuccess: () => {
            if (clearSelection) clearSelection();
          },
        },
      );
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-xl">
      {isDeleting && (
        <div
          className="absolute inset-0 z-10 flex cursor-not-allowed items-center justify-center bg-white/60 backdrop-blur-sm"
          aria-disabled="true"
        >
          <span className="text-muted-foreground">{t("content.deleting")}</span>
        </div>
      )}
      <Card
        className={
          isDeleting ? "pointer-events-none opacity-60 select-none" : ""
        }
      >
        <CardHeader>
          <CardTitle className="mb-2 text-xl font-semibold">
            {notification.title}
          </CardTitle>
          <div className="text-muted-foreground text-sm">
            {new Date(notification.createdAt).toLocaleString(
              locale === "es" ? "es-ES" : "en-US",
              {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              },
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
            disabled={deleteNotif.status === "pending" || isDeleting}
          >
            {isDeleting || deleteNotif.status === "pending"
              ? t("content.deleting")
              : t("content.delete")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
