"use client";

import React from "react";
import { useLocale } from "next-intl";

import { Card, CardContent } from "@/shared/components/ui/card";

import { formatNotificationDate } from "@/features/notifications/utils/format-notification-date";
import { getDateFnsLocale } from "@/features/notifications/utils/get-date-fns-locale";
import type { Notification } from "@/features/notifications/types";
import clsx from "clsx";

type Props = {
  notification: Notification;
  selected?: boolean;
  onClick?: () => void;
};

export const NotificationItem = React.forwardRef<
  HTMLButtonElement,
  Props & {
    tabIndex?: number;
    onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
>(
  (
    { notification, selected, onClick, tabIndex = 0, onKeyDown, ...props },
    ref,
  ) => {
    const locale = useLocale();
    const formattedDate = React.useMemo(
      () =>
        formatNotificationDate(
          notification.createdAt,
          getDateFnsLocale(locale),
        ),
      [notification.createdAt, locale],
    );
    return (
      <button
        ref={ref}
        className={clsx(
          "focus:ring-primary flex w-full flex-col gap-1 px-4 py-3 text-left focus:ring-2 focus:outline-none",
          selected ? "ring-primary ring-2" : "",
        )}
        onClick={onClick}
        aria-current={selected}
        aria-label={`Notificación: ${notification.title}`}
        type="button"
        tabIndex={tabIndex}
        onKeyDown={onKeyDown}
        {...props}
      >
        <Card
          className={clsx(
            "w-full cursor-pointer border transition-colors",
            selected
              ? "border-primary bg-accent"
              : "border-border bg-background",
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
  },
);
NotificationItem.displayName = "NotificationItem";
