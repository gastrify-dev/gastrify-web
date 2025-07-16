"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { Notification } from "../types";
import { formatNotificationDate } from "../utils/format-notification-date";
import { getDateFnsLocale } from "../utils/get-date-fns-locale";
import { Card, CardContent } from "@/shared/components/ui/card";
import clsx from "clsx";

type Props = {
  notification: Notification;
  selected?: boolean;
  onClick?: () => void;
  isDeleting?: boolean;
};

export const NotificationItem = React.forwardRef<
  HTMLButtonElement,
  Props & {
    tabIndex?: number;
    onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
>(
  (
    {
      notification,
      selected,
      onClick,
      isDeleting = false,
      tabIndex = 0,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const t = useTranslations("features.notifications");
    const locale = useLocale();
    const formattedDate = React.useMemo(
      () =>
        formatNotificationDate(
          notification.createdAt,
          getDateFnsLocale(locale),
        ),
      [notification.createdAt, locale],
    );
    const deletingText = t("content.deleting");
    return (
      <button
        ref={ref}
        className={clsx(
          "focus:ring-primary flex w-full flex-col gap-1 px-4 py-3 text-left focus:ring-2 focus:outline-none",
          selected ? "ring-primary ring-2" : "",
          isDeleting ? "pointer-events-none opacity-50 select-none" : "",
        )}
        onClick={isDeleting ? undefined : onClick}
        aria-current={selected}
        aria-label={`Notificación: ${notification.title}`}
        type="button"
        tabIndex={isDeleting ? -1 : tabIndex}
        onKeyDown={isDeleting ? undefined : onKeyDown}
        disabled={isDeleting}
        aria-disabled={isDeleting}
        {...props}
      >
        <Card
          className={clsx(
            "w-full cursor-pointer border transition-colors",
            selected
              ? "border-primary bg-accent"
              : "border-border bg-background",
            !notification.read ? "font-bold" : "opacity-70",
            isDeleting ? "cursor-not-allowed opacity-30" : "",
          )}
        >
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <span className="max-w-xs truncate">
                {isDeleting ? deletingText : notification.title}
              </span>
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
