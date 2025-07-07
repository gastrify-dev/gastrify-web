import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";
import type { AuthClientError } from "@/shared/types";

import type { RecoveryVariables } from "@/features/auth/types";

interface Props {
  form: UseFormReturn<RecoveryVariables>;
}

export const useRecoveryMutation = ({ form }: Props) => {
  const router = useRouter();

  const t = useTranslations("features.auth.use-recovery-mutation");

  return useMutation({
    mutationFn: async (variables: RecoveryVariables) => {
      const { error } = await authClient.twoFactor.verifyBackupCode({
        code: variables.code,
      });

      if (error) return Promise.reject(error);
    },
    onSuccess: () => {
      toast.info(t("info-toast"), {
        dismissible: false,
        closeButton: true,
        duration: 20_000,
        action: {
          label: t("info-toast-action-label"),
          onClick: () => router.push("/settings/security"),
        },
      });

      router.push("/home");
    },
    onError: (error: AuthClientError) => {
      if (error.status === RATE_LIMIT_ERROR_CODE) return;

      switch (error.code) {
        case "INVALID_BACKUP_CODE":
          form.setError("code", {
            message: t("error-invalid-code-message"),
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
  });
};
