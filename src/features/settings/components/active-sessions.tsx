"use client";

import { LoaderIcon, RotateCcwIcon } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { TypographyH4 } from "@/shared/components/ui/typography";

import { ActiveSessionCard } from "@/features/settings/components/active-session-card";
import { ActiveSessionCardSkeleton } from "@/features/settings/components/active-session-card-skeleton";
import { useActiveSessions } from "@/features/settings/hooks/use-active-sessions";

export const ActiveSessions = () => {
  const {
    sessions,
    isSessionsSuccess,
    isSessionsLoading,
    isSessionsFetching,
    isSessionsError,
    refetchSessions,
    isSessionsRefetching,
    session,
    t,
  } = useActiveSessions();

  return (
    <div className="flex flex-col gap-4">
      <TypographyH4 className="mb-4 flex items-center gap-2">
        {t("title")} {isSessionsSuccess && `(${sessions?.length})`}{" "}
        {isSessionsFetching && (
          <LoaderIcon className="animate-spin" size={18} />
        )}
      </TypographyH4>

      {isSessionsLoading && <ActiveSessionCardSkeleton />}

      {isSessionsError && (
        <Button
          variant="outline"
          type="button"
          onClick={() => refetchSessions()}
        >
          {t("retry-button")}
          {isSessionsRefetching ? (
            <LoaderIcon className="animate-spin" />
          ) : (
            <RotateCcwIcon />
          )}
        </Button>
      )}

      {isSessionsSuccess && (
        <div className="flex flex-wrap items-start gap-4">
          {sessions!.map((sessionData) => (
            <ActiveSessionCard
              key={sessionData.token}
              session={sessionData}
              isCurrentSession={session?.session.token === sessionData.token}
              isSessionsFetching={isSessionsFetching}
            />
          ))}
        </div>
      )}
    </div>
  );
};
