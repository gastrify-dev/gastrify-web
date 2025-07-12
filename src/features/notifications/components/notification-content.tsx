"use client";

import { Notification } from "../types";
import { useLocale, useTranslations } from "next-intl";
import { useDeleteNotification } from "../hooks/use-delete-notification";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";

type Props = {
  notification: Notification;
};

export default function NotificationContent({ notification }: Props) {
  const locale = useLocale();
  const t = useTranslations("features.notifications.content");
  const deleteNotif = useDeleteNotification();

  return (
    <Card className="mx-auto w-full max-w-xl">
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
          onClick={() => deleteNotif.mutate(notification.id)}
          disabled={deleteNotif.isPending}
        >
          {t("delete")}
        </Button>
      </CardFooter>
    </Card>
  );
}
