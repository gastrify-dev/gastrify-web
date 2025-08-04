"use client";

import Link from "next/link";
import { DotIcon } from "lucide-react";

import { cn } from "@/shared/utils/cn";

import {
  TypographyLarge,
  TypographySmall,
} from "@/shared/components/ui/typography";

import { useNotificationPreview } from "@/features/notifications/hooks/use-notification-preview";
import type { Notification } from "@/features/notifications/types";

type Props = {
  notification: Notification;
};

export const NotificationPreview = ({ notification }: Props) => {
  const { formattedDate, isActive, handleUpdateNotification } =
    useNotificationPreview({
      id: notification.id,
      createdAt: notification.createdAt,
    });

  return (
    <Link
      href={`/notifications/${notification.id}`}
      className={cn(
        "hover:bg-accent bg-accent/25 relative flex w-full flex-col gap-1 rounded-xl p-4 transition-all duration-200",
        isActive && "bg-accent",
      )}
      onClick={handleUpdateNotification}
    >
      <div className="flex items-center justify-between gap-4">
        {!notification.read && (
          <DotIcon className="absolute -right-0 -bottom-0 size-12" />
        )}

        <TypographyLarge className="flex items-center text-sm">
          {notification.title}{" "}
        </TypographyLarge>

        <TypographySmall className="text-muted-foreground text-xs">
          {formattedDate}
        </TypographySmall>
      </div>

      <TypographySmall className="text-muted-foreground text-xs text-ellipsis">
        {notification.preview}
      </TypographySmall>
    </Link>
  );
};
