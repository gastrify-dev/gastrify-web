"use client";

import { useLocale } from "next-intl";

import { Card, CardContent } from "@/shared/components/ui/card";
import { cn } from "@/shared/utils/cn";

import { formatNotificationDate } from "@/features/notifications/utils/format-notification-date";
import { getDateFnsLocale } from "@/features/notifications/utils/get-date-fns-locale";
import type { Notification as INotification } from "@/features/notifications/types";

type Props = {
  notification: INotification;
  selected?: boolean;
  onClick?: () => void;
};

export const Notification = ({ notification, selected, onClick }: Props) => {
  const locale = useLocale();
  const formattedDate = formatNotificationDate(
    notification.createdAt,
    getDateFnsLocale(locale),
  );

  return (
    <Card
      className={cn(
        "w-full cursor-pointer border transition-colors",
        selected ? "border-primary bg-accent" : "border-border bg-background",
        !notification.read && !selected ? "font-bold" : "opacity-70",
      )}
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="flex items-center justify-between">
          <span className="max-w-xs truncate">{notification.title}</span>
          <span className="text-muted-foreground text-xs">
            {formattedDate || "\u00A0"}
          </span>
        </div>
        <div className="text-muted-foreground hidden truncate text-sm md:block">
          {notification.preview}
        </div>
        <div
          className={cn(
            "text-muted-foreground text-sm md:hidden",
            !selected && "truncate",
          )}
        >
          {selected ? notification.content : notification.preview}
        </div>
      </CardContent>
    </Card>
  );
};
