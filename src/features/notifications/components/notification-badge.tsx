import { Badge } from "@/shared/components/ui/badge";

interface Props {
  count: number;
}

export function NotificationBadge({ count }: Props) {
  if (!count || count < 1) return null;

  return (
    <Badge
      variant="destructive"
      className="!bg-destructive border-background absolute -top-1.5 left-full min-w-5 -translate-x-3.5 px-1 !text-white !opacity-100"
    >
      {count}
    </Badge>
  );
}
