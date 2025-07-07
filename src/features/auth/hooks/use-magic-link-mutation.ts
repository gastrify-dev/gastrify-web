import { UseFormReturn } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";
import type { AuthClientError } from "@/shared/types";

import type { MagicLinkVariables } from "@/features/auth/types";

interface Props {
  form: UseFormReturn<MagicLinkVariables>;
}

export const useMagicLinkMutation = ({ form }: Props) => {
  const t = useTranslations("features.auth.use-magic-link-mutation");

  return useMutation({
    mutationFn: async (variables: MagicLinkVariables) => {
      const { error } = await authClient.signIn.magicLink({
        email: variables.email,
        callbackURL: "/home",
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
        case "USER_NOT_FOUND":
          form.setError("email", {
            message: t("error-user-not-found-message"),
          });
          return;

        case "FAILED_TO_SEND_MAGIC_LINK":
          toast.error(t("error-failed-to-send-magic-link-message"), {
            description: t("error-failed-to-send-magic-link-description"),
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
