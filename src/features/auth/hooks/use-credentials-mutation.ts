import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";
import type { AuthClientError } from "@/shared/types";

import type { CredentialsVariables } from "@/features/auth/types";

interface Props {
  form: UseFormReturn<CredentialsVariables>;
}

export const useCredentialsMutation = ({ form }: Props) => {
  const router = useRouter();

  const t = useTranslations("features.auth.use-credentials-mutation");

  return useMutation({
    mutationFn: async (variables: CredentialsVariables) => {
      const { error } = await authClient.signIn.email(
        {
          email: variables.email,
          password: variables.password,
        },
        {
          async onSuccess(context) {
            if (context.data.twoFactorRedirect) {
              return router.push("/2fa");
            }

            return router.push("/home");
          },
        },
      );

      if (error) return Promise.reject(error);
    },
    onError: (error: AuthClientError) => {
      if (error.status === RATE_LIMIT_ERROR_CODE) return;

      switch (error.code) {
        case "INVALID_EMAIL_OR_PASSWORD":
          form.setError("email", {
            message: t("error-invalid-email-or-password-message"),
          });
          form.setError("password", {
            message: t("error-invalid-email-or-password-message"),
          });
          return;

        case "EMAIL_NOT_VERIFIED":
          toast.error(t("error-email-not-verified-message"), {
            description: t("error-email-not-verified-description"),
            duration: 10000,
          });
          return;

        default:
          toast.error(t("error-toast"), {
            description: t("error-toast-description"),
          });
          return;
      }
    },
  });
};
