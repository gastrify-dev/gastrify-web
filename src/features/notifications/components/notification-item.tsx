"use client";

import React from "react";
import { Notification } from "../types";
import { formatNotificationDate } from "../utils/format-notification-date";
import { getDateFnsLocale } from "../utils/get-date-fns-locale";
import { useLocale } from "next-intl";
import { Card, CardContent } from "@/shared/components/ui/card";
import clsx from "clsx";

type Props = {
  notification: Notification;
  selected?: boolean;
  onClick?: () => void;
};

export function NotificationItem({ notification, selected, onClick }: Props) {
  const locale = useLocale();
  const formattedDate = React.useMemo(
    () =>
      formatNotificationDate(notification.createdAt, getDateFnsLocale(locale)),
    [notification.createdAt, locale],
  );
  return (
    <button
      className="flex w-full flex-col gap-1 px-4 py-3 text-left"
      onClick={onClick}
      aria-current={selected}
      type="button"
    >
      <Card
        className={clsx(
          "w-full cursor-pointer border transition-colors",
          selected ? "border-primary bg-accent" : "border-border bg-background",
          !notification.read ? "font-bold" : "opacity-70",
        )}
      >
        <CardContent className="p-0">
          <div className="flex items-center justify-between">
            <span className="max-w-xs truncate">{notification.title}</span>
            <span className="text-muted-foreground text-xs">
              {formattedDate}
            </span>
          </div>
          <div className="text-muted-foreground hidden truncate text-sm md:block">
            {notification.preview}
          </div>
          <div
            className={clsx(
              "text-muted-foreground text-sm md:hidden",
              !selected && "truncate",
            )}
          >
            {selected ? notification.content : notification.preview}
          </div>
        </CardContent>
      </Card>
    </button>
  );
}
