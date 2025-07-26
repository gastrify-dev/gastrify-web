import { useTranslations } from "next-intl";

import { useNotifications } from "@/features/notifications/hooks/use-notifications";

export function useNotificationsSidebar() {
  const { data, isLoading, isError, refetch, isRefetching } =
    useNotifications();

  const t = useTranslations("features.notifications.notifications-sidebar");

  return {
    data,
    isLoading,
    isError,
    refetch,
    isRefetching,
    t,
  };
}
