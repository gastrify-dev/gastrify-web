import { useTranslations } from "next-intl";

import { useSession } from "@/shared/hooks/use-session";

import { useSessions } from "@/features/settings/hooks/use-sessions";

export const useActiveSessions = () => {
  const {
    data: sessions,
    isSuccess: isSessionsSuccess,
    isLoading: isSessionsLoading,
    isFetching: isSessionsFetching,
    isError: isSessionsError,
    refetch: refetchSessions,
    isRefetching: isSessionsRefetching,
  } = useSessions();

  const { data: session } = useSession();

  const t = useTranslations("features.settings.active-sessions");

  return {
    sessions,
    isSessionsSuccess,
    isSessionsLoading,
    isSessionsFetching,
    isSessionsError,
    refetchSessions,
    isSessionsRefetching,
    session,
    t,
  };
};
