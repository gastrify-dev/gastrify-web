import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import { useSession } from "@/shared/hooks/use-session";

import { useGenerateBackupCodesMutation } from "@/features/settings/hooks/use-generate-backup-codes-mutation";
import { generateBackupCodesSchema } from "@/features/settings/schemas/generate-backup-codes";
import type { GenerateBackupCodesVariables } from "@/features/settings/types";

export const useGenerateBackupCodesForm = () => {
  const { data: session } = useSession();

  const t = useTranslations("features.settings.generate-backup-codes-form");

  const form = useForm<GenerateBackupCodesVariables>({
    resolver: zodResolver(generateBackupCodesSchema),
    defaultValues: {
      generateBackupCodes: false,
      password: "",
    },
  });

  const { mutate, isPending, isError } = useGenerateBackupCodesMutation({
    form,
  });

  const onSubmit = (variables: GenerateBackupCodesVariables) =>
    mutate({
      password: variables.password,
    });

  return {
    form,
    onSubmit,
    isPending,
    isError,
    isTwoFactorEnabled: !!session?.user.twoFactorEnabled,
    t,
  };
};
