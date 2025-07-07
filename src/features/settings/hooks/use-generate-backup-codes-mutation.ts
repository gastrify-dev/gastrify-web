import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { authClient } from "@/shared/lib/better-auth/client";

import { getTxtArrayBuffer } from "@/features/settings/utils/get-txt-array-buffer";
import type { GenerateBackupCodesVariables } from "@/features/settings/types";

interface Props {
  form: UseFormReturn<GenerateBackupCodesVariables>;
}

export const useGenerateBackupCodesMutation = ({ form }: Props) => {
  const queryClient = useQueryClient();

  const t = useTranslations(
    "features.settings.use-generate-backup-codes-mutation",
  );

  return useMutation({
    mutationFn: async (
      variables: Pick<GenerateBackupCodesVariables, "password">,
    ) => {
      const { data, error } = await authClient.twoFactor.generateBackupCodes({
        password: variables.password,
      });

      if (error) return Promise.reject(error);

      return data;
    },
    onSuccess: (data) => {
      const buffer = getTxtArrayBuffer(data.backupCodes);

      const blob = new Blob([buffer], { type: "text/plain" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "stories-backup-codes.txt";
      a.click();

      URL.revokeObjectURL(url);

      toast.success(t("success-toast"), {
        duration: 10_000,
      });

      form.reset();
    },
    onError: () => {
      toast.error(t("error-toast"), {
        description: t("error-toast-description"),
        duration: 10_000,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["session", "details"] });
    },
  });
};
