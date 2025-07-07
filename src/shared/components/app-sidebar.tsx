"use client";

import { LoaderIcon, RotateCcwIcon } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { NavLink } from "@/shared/components/nav-link";
import { NavUser } from "@/shared/components/nav-user";
import { NavUserSkeleton } from "@/shared/components/nav-user-skeleton";
import { useAppSidebar } from "@/shared/hooks/use-app-sidebar";

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

  return (
    <div className="flex flex-col items-center gap-4 md:items-stretch">
      <div className="bg-accent flex aspect-square flex-wrap place-content-center self-start rounded-full p-2 text-4xl font-extrabold lg:text-5xl">
        G
      </div>

      <nav className="flex flex-col items-start gap-2 md:items-stretch">
        {links.map((link) => (
          <NavLink
            key={link.href}
            href={link.href}
            label={link.label}
            icon={link.icon}
          />
        ))}
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
