import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";
import type { AuthClientError } from "@/shared/types";

import type { UpdatePasswordVariables } from "@/features/settings/types";

interface Props {
  form: UseFormReturn<UpdatePasswordVariables>;
}

export const useUpdatePasswordMutation = ({ form }: Props) => {
  const queryClient = useQueryClient();

  const t = useTranslations("features.settings.use-update-password-mutation");

  return useMutation({
    mutationFn: async ({
      currentPassword,
      newPassword,
    }: UpdatePasswordVariables) => {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (error) return Promise.reject(error);
    },
    onSuccess: () => {
      toast.success(t("success-toast"), {
        duration: 10_000,
      });

      form.reset();
    },
    onError: (error: AuthClientError) => {
      if (error.status === RATE_LIMIT_ERROR_CODE) return;

      switch (error.code) {
        case "INVALID_PASSWORD":
          form.setError("currentPassword", {
            message: t("invalid-password-error"),
          });
          return;

        case "PASSWORD_COMPROMISED":
          form.setError("newPassword", {
            message: t("password-compromised-error"),
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
