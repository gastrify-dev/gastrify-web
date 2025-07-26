import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { formatDistanceToNow } from "date-fns";
import { es, enUS } from "date-fns/locale";

import { useUpdateNotificationMutation } from "@/features/notifications/hooks/use-update-notification-mutation";

type Props = {
  id: string;
  createdAt: Date;
};

export const useNotificationPreview = ({ id, createdAt }: Props) => {
  const locale = useLocale();

  const formattedDate = formatDistanceToNow(createdAt, {
    addSuffix: true,
    locale: locale === "es" ? es : enUS,
  });

  const pathname = usePathname();

  const isActive = pathname === `/notifications/${id}`;

  const { mutate: updateNotification } = useUpdateNotificationMutation();

  const handleUpdateNotification = () => updateNotification({ id, read: true });

  return {
    locale,
    formattedDate,
    pathname,
    isActive,
    handleUpdateNotification,
  };
};
