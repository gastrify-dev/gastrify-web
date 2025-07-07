import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import { useSession } from "@/shared/hooks/use-session";

import { useUpdateLanguageMutation } from "@/features/settings/hooks/use-update-language-mutation";
import { updateLanguageSchema } from "@/features/settings/schemas/update-language";
import type { UpdateLanguageVariables } from "@/features/settings/types";

export const useUpdateLanguageForm = () => {
  const {
    data: session,
    isSuccess: isSessionSuccess,
    isLoading: isSessionLoading,
    isError: isSessionError,
    refetch: refetchSession,
    isRefetching: isSessionRefetching,
  } = useSession();

  const form = useForm<UpdateLanguageVariables>({
    resolver: zodResolver(updateLanguageSchema),
    values: {
      language: session?.user.language ?? "es",
    },
  });

  const { mutate, isPending, isError } = useUpdateLanguageMutation({ form });

  const { isDirty, isValid } = form.formState;

  const canSubmit =
    isDirty &&
    isValid &&
    form.watch("language").trim() !== session?.user.language;

  const onSubmit = (values: UpdateLanguageVariables) => mutate(values);

  const t = useTranslations("features.settings.update-language-form");

  return {
    form,
    canSubmit,
    onSubmit,
    isPending,
    isError,
    isSessionSuccess,
    isSessionLoading,
    isSessionError,
    refetchSession,
    isSessionRefetching,
    t,
  };
};
