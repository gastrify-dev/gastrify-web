import { useTranslations } from "next-intl";

import { useRevokeSessionMutation } from "@/features/settings/hooks/use-revoke-session-mutation";

export const useActiveSessionCard = () => {
  const { mutate } = useRevokeSessionMutation();

  const handleRevokeSession = (token: string) => mutate(token);

  const t = useTranslations("features.settings.active-session-card");

  return { handleRevokeSession, t };
};
