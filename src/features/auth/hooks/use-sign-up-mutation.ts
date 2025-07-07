import { UseFormReturn } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";
import type { AuthClientError } from "@/shared/types";

import { getHash } from "@/features/auth/utils/get-hash";
import type { SignUpVariables } from "@/features/auth/types";

interface Props {
  form: UseFormReturn<SignUpVariables>;
}

export const useSignUpMutation = ({ form }: Props) => {
  const t = useTranslations("features.auth.use-sign-up-mutation");

  return useMutation({
    mutationFn: async (variables: SignUpVariables) => {
      const hash = await getHash(variables.email);
      const image = `https://gravatar.com/avatar/${hash}?size=500&d=robohash&r=x`;

      const { data, error } = await authClient.signUp.email({
        name: variables.name,
        email: variables.email,
        identificationNumber: variables.identificationNumber,
        password: variables.password,
        image,
        callbackURL: "/home",
      });

      if (error) return Promise.reject(error);

      return data;
    },
    onSuccess: () => {
      toast.success(t("success-toast"), {
        description: t("success-toast-description"),
        duration: 10_000,
      });

      form.reset();
    },
    onError: (error: AuthClientError, variables) => {
      if (error.status === RATE_LIMIT_ERROR_CODE) return;

      if (
        (error as unknown as { details?: { cause: { constraint: string } } })
          ?.details?.cause?.constraint === "user_identification_number_unique"
      ) {
        form.setError("identificationNumber", {
          message: t("error-identification-number-already-taken-message"),
        });
        return;
      }

      switch (error.code) {
        case "USER_ALREADY_EXISTS":
          form.setError("email", {
            message: t("error-user-already-exists-message"),
          });
          return;

        case "PASSWORD_COMPROMISED":
          form.setError("password", {
            message: t("error-password-compromised-message"),
          });
          return;

        case "FAILED_TO_SEND_VERIFICATION_EMAIL":
          const toastId = toast.error(
            t("error-failed-to-send-verification-email-message"),
            {
              duration: 10_000,
              action: {
                label: t(
                  "error-failed-to-send-verification-email-action-label",
                ),
                onClick: async () => {
                  const id = toast.loading(
                    t(
                      "error-failed-to-send-verification-email-loading-message",
                    ),
                  );

                  const { error } = await authClient.sendVerificationEmail({
                    email: variables.email,
                    callbackURL: "/home",
                  });

                  if (error) {
                    if (error.status === 429) return;

                    toast.dismiss(id);
                    toast.error(
                      t("error-failed-to-send-verification-email-message"),
                      {
                        id: toastId,
                        duration: 10_000,
                      },
                    );
                    return;
                  }
                },
              },
            },
          );
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
