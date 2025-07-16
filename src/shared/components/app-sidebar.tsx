"use client";

import { LoaderIcon, RotateCcwIcon } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { NavLink } from "@/shared/components/nav-link";
import { NavUser } from "@/shared/components/nav-user";
import { NavUserSkeleton } from "@/shared/components/nav-user-skeleton";
import { useAppSidebar } from "@/shared/hooks/use-app-sidebar";
import { useUnreadNotifications } from "@/features/notifications/hooks/use-unread-notifications";
import { NotificationBadge } from "@/features/notifications/components/notification-badge";

export const AppSidebar = () => {
  const {
    links,
    session,
    isSessionSuccess,
    isSessionLoading,
    isSessionError,
    refetchSession,
    isSessionRefetching,
    t,
  } = useAppSidebar();
  const { data: unreadData } = useUnreadNotifications();
  const unreadCount = unreadData?.data ?? 0;

  return (
    <div className="flex flex-col items-center gap-4 md:items-stretch">
      <div className="bg-accent flex aspect-square flex-wrap place-content-center self-start rounded-full p-2 text-4xl font-extrabold lg:text-5xl">
        G
      </div>

      <nav className="flex flex-col items-start gap-2 md:items-stretch">
        {links.map((link) =>
          link.href === "/notifications" ? (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              icon={
                <span className="relative">
                  {link.icon}
                  <NotificationBadge
                    count={unreadCount}
                    className="border-background absolute -top-1.5 left-full min-w-5 -translate-x-3.5 px-1"
                  />
                </span>
              }
            />
          ) : (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              icon={link.icon}
            />
          ),
        )}
      </nav>

      <div className="mt-auto max-w-60">
        {isSessionLoading && <NavUserSkeleton />}

        {isSessionError && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => refetchSession()}
          >
            {t("retryButton")}{" "}
            {isSessionRefetching ? (
              <LoaderIcon className="animate-spin" />
            ) : (
              <RotateCcwIcon />
            )}
          </Button>
        )}

        {isSessionSuccess && session && <NavUser user={session.user} />}
      </div>
    </div>
  );
};
