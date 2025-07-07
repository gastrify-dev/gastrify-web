import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";
import type { AuthClientError } from "@/shared/types";

import type { ResetPasswordVariables } from "@/features/auth/types";

interface Props {
  token: string;
}

export const useResetPasswordMutation = ({ token }: Props) => {
  const router = useRouter();

  const t = useTranslations("features.auth.use-reset-password-mutation");

  return useMutation({
    mutationFn: async (variables: ResetPasswordVariables) => {
      const { error } = await authClient.resetPassword({
        newPassword: variables.password,
        token,
      });

      if (error) return Promise.reject(error);
    },
    onSuccess: () => {
      toast.success(t("success-toast"), {
        description: t("success-toast-description"),
        duration: 10_000,
      });

      router.push("/sign-in");
    },
    onError: (error: AuthClientError) => {
      if (error.status === RATE_LIMIT_ERROR_CODE) return;

      switch (error.code) {
        case "INVALID_TOKEN":
          toast.error(t("error-invalid-token-message"), {
            description: t("error-invalid-token-description"),
            duration: 10_000,
            action: {
              label: t("error-invalid-token-action-label"),
              onClick: () => router.push("/forgot-password"),
            },
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
