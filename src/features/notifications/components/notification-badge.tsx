import { Badge } from "@/shared/components/ui/badge";
import React from "react";

export function NotificationBadge({
  count,
  className = "",
}: {
  count: number;
  className?: string;
}) {
  if (!count || count < 1) return null;
  return (
    <Badge
      variant="destructive"
      className={`!bg-destructive min-w-5 px-1 !text-white !opacity-100 ${className}`}
      aria-label={count + " unread notifications"}
    >
      {count}
    </Badge>
  );
}
