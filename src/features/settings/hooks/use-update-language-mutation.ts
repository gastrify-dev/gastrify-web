import { UseFormReturn } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";
import type { AuthClientError, Session } from "@/shared/types";

import type { UpdateLanguageVariables } from "@/features/settings/types";

interface Props {
  form: UseFormReturn<UpdateLanguageVariables>;
}

export const useUpdateLanguageMutation = ({ form }: Props) => {
  const queryClient = useQueryClient();

  const router = useRouter();

  const t = useTranslations("features.settings.use-update-language-mutation");

  return useMutation({
    mutationFn: async (variables: UpdateLanguageVariables) => {
      const { error } = await authClient.updateUser({
        language: variables.language,
      });

      if (error) return Promise.reject(error);
    },
    onSuccess: (_data, variables) => {
      toast.success(t("success-toast"), {
        duration: 10_000,
      });

      queryClient.setQueryData(["session", "details"], (old: Session) => ({
        ...old,
        user: {
          ...old.user,
          language: variables.language,
        },
      }));

      form.reset({ language: variables.language });

      router.refresh();
    },
    onError: (error: AuthClientError) => {
      if (error.status === RATE_LIMIT_ERROR_CODE) return;

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
