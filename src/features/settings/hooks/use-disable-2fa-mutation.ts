import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";
import type { AuthClientError, Session } from "@/shared/types";

import type { UpdateTwoFactorVariables } from "@/features/settings/types";

interface Props {
  form: UseFormReturn<UpdateTwoFactorVariables>;
}

export const useDisable2FAMutation = ({ form }: Props) => {
  const queryClient = useQueryClient();

  const t = useTranslations("features.settings.use-disable-2fa-mutation");

  return useMutation({
    mutationFn: async (
      variables: Pick<UpdateTwoFactorVariables, "password">,
    ) => {
      const { error } = await authClient.twoFactor.disable({
        password: variables.password,
      });

      if (error) return Promise.reject(error);
    },
    onSuccess: () => {
      toast.success(t("success-toast"), {
        duration: 10_000,
      });

      queryClient.setQueryData(
        ["session", "details"],
        (old: Session): Session => {
          return {
            session: old.session,
            user: { ...old.user, twoFactorEnabled: false },
          };
        },
      );

      form.reset({ enable2FA: false });
    },
    onError: (error: AuthClientError) => {
      if (error.status === RATE_LIMIT_ERROR_CODE) return;

      switch (error.code) {
        case "INVALID_PASSWORD":
          form.setError("password", {
            message: t("invalid-password-error"),
          });
          return;

        default:
          toast.error(t("error-toast"), {
            description: t("error-toast-description"),
            duration: 10_000,
          });
          return;
      }
    },
    // We do both in this case because not doing so
    // will cause the session to be out of sync with the sessions queries
    onSettled: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["session", "details"] }),
        queryClient.invalidateQueries({ queryKey: ["session", "list"] }),
      ]);
    },
  });
};
