import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";
import type { AuthClientError } from "@/shared/types";

import type { ForgotPasswordVariables } from "@/features/auth/types";

export const useForgotPasswordMutation = () => {
  const t = useTranslations("features.auth.use-forgot-password-mutation");

  return useMutation({
    mutationFn: async (variables: ForgotPasswordVariables) => {
      const { error } = await authClient.forgetPassword({
        email: variables.email,
        redirectTo: "/reset-password",
      });

      if (error) return Promise.reject(error);
    },
    onSuccess: () => {
      toast.success(t("success-toast"), {
        description: t("success-toast-description"),
        duration: 10_000,
      });
    },
    onError: (error: AuthClientError) => {
      if (error.status === RATE_LIMIT_ERROR_CODE) return;

      switch (error.code) {
        case "FAILED_TO_SEND_RESET_PASSWORD_EMAIL":
          toast.error(t("error-failed-to-send-reset-password-email-message"), {
            description: t(
              "error-failed-to-send-reset-password-email-description",
            ),
            duration: 10_000,
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
