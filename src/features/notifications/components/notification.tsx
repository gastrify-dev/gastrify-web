"use client";

import { LoaderIcon, TrashIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es, enUS } from "date-fns/locale";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { TypographyP } from "@/shared/components/ui/typography";

import { useNotification } from "@/features/notifications/hooks/use-notification";
import { NotificationSkeleton } from "@/features/notifications/components/notification-skeleton";

interface Props {
  id: string;
}

export const Notification = ({ id }: Props) => {
  const {
    data,
    isLoading,
    isError,
    refetch,
    isRefetching,
    t,
    handleDelete,
    locale,
  } = useNotification({ id });

  if (isLoading) return <NotificationSkeleton />;

  if (isError)
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center gap-2">
        {t("error-message")}
        <Button
          variant="destructive"
          disabled={isRefetching}
          onClick={() => refetch()}
        >
          {isRefetching && <LoaderIcon className="animate-spin" />}
          {t("refetch-button")}
        </Button>
      </div>
    );

  return (
    <Card className="flex-1 border-none bg-transparent p-0">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{data!.title}</CardTitle>

        <CardDescription className="text-muted-foreground text-sm">
          {formatDistanceToNow(data!.createdAt, {
            addSuffix: true,
            locale: locale === "es" ? es : enUS,
          })}
        </CardDescription>

        <CardAction>
          <Button
            variant="destructive"
            className="rounded-full"
            size="icon"
            onClick={handleDelete}
          >
            <TrashIcon className="size-4" />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <TypographyP>{data!.content}</TypographyP>
      </CardContent>
    </Card>
  );
};
