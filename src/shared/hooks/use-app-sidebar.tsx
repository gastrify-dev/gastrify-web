import { useMemo } from "react";
import {
  HomeIcon,
  UserRoundIcon,
  SettingsIcon,
  CalendarIcon,
  BellIcon,
  UserRoundCogIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { useSession } from "@/shared/hooks/use-session";

import { NotificationBadge } from "@/features/notifications/components/notification-badge";
import { useNotifications } from "@/features/notifications/hooks/use-notifications";

export const useAppSidebar = () => {
  const t = useTranslations("shared.app-sidebar");

  const {
    data: session,
    isSuccess: isSessionSuccess,
    isLoading: isSessionLoading,
    isError: isSessionError,
    refetch: refetchSession,
    isRefetching: isSessionRefetching,
  } = useSession();

  const { data: notifications } = useNotifications();

  const unreadNotificationsCount =
    notifications?.filter((notification) => !notification.read).length ?? 0;

  const links = useMemo(() => {
    const baseLinks = [
      { href: "/home", label: t("home"), icon: <HomeIcon /> },
      {
        href: "/appointments",
        label: t("appointments"),
        icon: <CalendarIcon />,
      },
      {
        href: "/notifications",
        label: t("notifications"),
        icon: (
          <span className="relative">
            <BellIcon />
            <NotificationBadge count={unreadNotificationsCount} />
          </span>
        ),
      },
      {
        href: `/${session?.user.identificationNumber}`,
        label: t("profile"),
        icon: <UserRoundIcon />,
      },
      {
        href: "/settings",
        label: t("settings"),
        icon: <SettingsIcon />,
      },
    ];

    if (session?.user.role === "admin") {
      baseLinks.splice(-1, 0, {
        href: "/admin",
        label: "Admin",
        icon: <UserRoundCogIcon />,
      });
    }

    return baseLinks;
  }, [
    session?.user.identificationNumber,
    session?.user.role,
    t,
    unreadNotificationsCount,
  ]);

  return {
    links,
    session,
    isSessionSuccess,
    isSessionLoading,
    isSessionError,
    refetchSession,
    isSessionRefetching,
    t,
  };
};
