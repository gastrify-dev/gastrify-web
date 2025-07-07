import { Dispatch, SetStateAction } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";
import type { AuthClientError, TwoFactorVariables } from "@/shared/types";

interface Props {
  form: UseFormReturn<TwoFactorVariables>;
  setTotpURI: Dispatch<SetStateAction<string>>;
  setShowBackupCodes: Dispatch<SetStateAction<boolean>>;
}

export const useVerifyTotpMutation = ({
  form,
  setTotpURI,
  setShowBackupCodes,
}: Props) => {
  const queryClient = useQueryClient();

  const t = useTranslations("features.settings.use-verify-totp-mutation");

  return useMutation({
    mutationFn: async ({ code }: { code: string }) => {
      const { error } = await authClient.twoFactor.verifyTotp({
        code,
      });

      if (error) return Promise.reject(error);
    },
    onSuccess: () => {
      toast.success(t("success-toast"), {
        duration: 10_000,
      });

      form.reset();
      setTotpURI("");
      setShowBackupCodes(true);
    },
    onError: (error: AuthClientError) => {
      if (error.status === RATE_LIMIT_ERROR_CODE) return;

      switch (error.code) {
        case "INVALID_TWO_FACTOR_AUTHENTICATION":
          form.setError("code", {
            message: t("invalid-one-time-password-message"),
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
    onSettled: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["session", "details"] }),
        queryClient.invalidateQueries({ queryKey: ["session", "list"] }),
      ]);
    },
  });
};
