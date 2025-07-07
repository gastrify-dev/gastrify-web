import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";
import type { AuthClientError } from "@/shared/types";

import type { UpdateIdentificationNumberVariables } from "@/features/settings/types";

interface Props {
  form: UseFormReturn<UpdateIdentificationNumberVariables>;
}

export const useUpdateIdentificationNumberMutation = ({ form }: Props) => {
  const queryClient = useQueryClient();

  const t = useTranslations(
    "features.settings.use-update-identification-number-mutation",
  );

  return useMutation({
    mutationFn: async (variables: UpdateIdentificationNumberVariables) => {
      const { error } = await authClient.updateUser({
        identificationNumber: variables.identificationNumber,
      });

      if (error) return Promise.reject(error);
    },
    onSuccess: (_data, variables) => {
      toast.success(t("success-toast"), {
        duration: 10_000,
      });

      form.reset({ identificationNumber: variables.identificationNumber });
    },
    onError: (error: AuthClientError) => {
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
        default:
          toast.error(t("error-toast"), {
            description: t("error-toast-description"),
            duration: 10_000,
          });
          return;
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["session", "details"] });
    },
  });
};
