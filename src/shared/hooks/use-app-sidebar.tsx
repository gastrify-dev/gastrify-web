import { useMemo } from "react";
import {
  HomeIcon,
  UserRoundIcon,
  SettingsIcon,
  CalendarIcon,
  BellIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { useSession } from "@/shared/hooks/use-session";

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

  const links = useMemo(
    () => [
      { href: "/home", label: t("home"), icon: <HomeIcon /> },
      {
        href: "/appointments",
        label: t("appointments"),
        icon: <CalendarIcon />,
      },
      {
        href: "/notifications",
        label: t("notifications"),
        icon: <BellIcon />,
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
    ],
    [session?.user.identificationNumber, t],
  );

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
