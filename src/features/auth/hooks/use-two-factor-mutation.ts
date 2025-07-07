import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";
import type { AuthClientError, TwoFactorVariables } from "@/shared/types";

interface Props {
  form: UseFormReturn<TwoFactorVariables>;
}

export const useTwoFactorMutation = ({ form }: Props) => {
  const router = useRouter();

  const t = useTranslations("features.auth.use-two-factor-mutation");

  return useMutation({
    mutationFn: async (variables: TwoFactorVariables) => {
      const { error } = await authClient.twoFactor.verifyTotp({
        code: variables.code,
      });

      if (error) return Promise.reject(error);
    },
    onSuccess: () => {
      router.push("/home");
    },
    onError: (error: AuthClientError) => {
      if (error.status === RATE_LIMIT_ERROR_CODE) return;

      switch (error.code) {
        case "INVALID_TWO_FACTOR_AUTHENTICATION":
          form.setError("code", {
            message: t("error-invalid-one-time-password-message"),
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
