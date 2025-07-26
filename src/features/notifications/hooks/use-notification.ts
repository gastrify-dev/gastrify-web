import { useLocale, useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useDeleteNotificationMutation } from "@/features/notifications/hooks/use-delete-notification-mutation";
import { getNotification } from "@/features/notifications/actions/get-notification";

interface Props {
  id: string;
}

export function useNotification({ id }: Props) {
  const locale = useLocale();
  const t = useTranslations("features.notifications.notification");
  const router = useRouter();

  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ["notification", "details", id],
    queryFn: async () => {
      const { data, error } = await getNotification({ id });

      if (error) return Promise.reject(error);

      return data;
    },
  });

  const { mutate: deleteNotification } = useDeleteNotificationMutation();

  const handleDelete = () => {
    deleteNotification({ id });
    router.push("/notifications");
  };

  return {
    data,
    isLoading,
    isError,
    refetch,
    isRefetching,
    locale,
    t,
    handleDelete,
  };
}
