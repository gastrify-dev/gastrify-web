import React from "react";
import { useTranslations } from "next-intl";

import { Badge } from "@/shared/components/ui/badge";

interface NotificationBadgeProps {
  count: number;
  className?: string;
}

export function NotificationBadge({
  count,
  className = "",
}: NotificationBadgeProps) {
  const t = useTranslations("features.notifications");
  if (!count || count < 1) return null;
  return (
    <Badge
      variant="destructive"
      className={`!bg-destructive min-w-5 px-1 !text-white !opacity-100 ${className}`}
      aria-label={t("badgeAriaLabel", { count })}
    >
      {count}
    </Badge>
  );
}
