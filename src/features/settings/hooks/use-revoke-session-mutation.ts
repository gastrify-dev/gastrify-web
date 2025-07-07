import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { authClient } from "@/shared/lib/better-auth/client";
import type { AuthClientError, Session } from "@/shared/types";

export const useRevokeSessionMutation = () => {
  const queryClient = useQueryClient();

  const t = useTranslations("features.settings.use-revoke-session-mutation");

  return useMutation({
    mutationFn: async (token: string) => {
      const { error } = await authClient.revokeSession({
        token,
      });

      if (error) return Promise.reject(error);
    },
    // When mutate is called:
    onMutate: async (token) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["session", "list"] });

      // Snapshot the previous value
      const previousSessions = queryClient.getQueryData<Session["session"][]>([
        "session",
        "list",
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(
        ["session", "list"],
        (old: Session["session"][]) =>
          old.filter((session) => session.token !== token),
      );

      // Return a context object with the snapshotted value
      return { previousSessions };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (error: AuthClientError, _token, context) => {
      queryClient.setQueryData(["session", "list"], context?.previousSessions);

      switch (error.code) {
        case "SESSION_NOT_FOUND":
          toast.info(t("session-not-found-error"), {
            duration: 5_000,
          });
          return;

        default:
          toast.error(t("error-toast"), {
            description: t("error-toast-description"),
            duration: 5_000,
          });
          return;
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["session", "list"] });
    },
  });
};
