import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";
import type { AuthClientError } from "@/shared/types";

import type { UpdateEmailVariables } from "@/features/settings/types";

interface Props {
  form: UseFormReturn<UpdateEmailVariables>;
}

export const useUpdateEmailMutation = ({ form }: Props) => {
  const queryClient = useQueryClient();

  const t = useTranslations("features.settings.use-update-email-mutation");

  return useMutation({
    mutationFn: async (variables: UpdateEmailVariables) => {
      const { error } = await authClient.changeEmail({
        newEmail: variables.email,
        callbackURL: "/settings/account",
      });

      if (error) return Promise.reject(error);
    },
    onSuccess: (_data, variables) => {
      toast.success(t("success-toast"), {
        description: t("success-toast-description"),
        duration: 20_000,
      });

      form.reset({ email: variables.email });
    },
    onError: (error: AuthClientError) => {
      if (error.status === RATE_LIMIT_ERROR_CODE) return;

      switch (error.code) {
        case "COULDNT_UPDATE_YOUR_EMAIL":
          form.setError("email", {
            message: t("error-user-already-exists-message"),
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
      queryClient.invalidateQueries({
        queryKey: ["session", "details"],
      });
    },
  });
};
