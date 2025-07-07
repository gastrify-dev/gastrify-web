import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import { useSession } from "@/shared/hooks/use-session";

import { useUpdateIdentificationNumberMutation } from "@/features/settings/hooks/use-update-identification-number-mutation";
import { updateIdentificationNumberSchema } from "@/features/settings/schemas/update-identification-number";
import type { UpdateIdentificationNumberVariables } from "@/features/settings/types";

export const useUpdateIdentificationNumberForm = () => {
  const {
    data: session,
    isSuccess: isSessionSuccess,
    isLoading: isSessionLoading,
    isError: isSessionError,
    refetch: refetchSession,
    isRefetching: isSessionRefetching,
  } = useSession();

  const form = useForm<UpdateIdentificationNumberVariables>({
    resolver: zodResolver(updateIdentificationNumberSchema),
    values: {
      identificationNumber: session?.user.identificationNumber ?? "",
    },
  });

  const { mutate, isPending, isError } = useUpdateIdentificationNumberMutation({
    form,
  });

  const { isDirty, isValid } = form.formState;

  const canSubmit =
    isDirty &&
    isValid &&
    form.watch("identificationNumber").trim() !==
      session?.user.identificationNumber;

  const onSubmit = (values: UpdateIdentificationNumberVariables) =>
    mutate(values);

  const t = useTranslations(
    "features.settings.update-identification-number-form",
  );

  return {
    form,
    canSubmit,
    onSubmit,
    isPending,
    isError,
    session,
    isSessionSuccess,
    isSessionLoading,
    isSessionError,
    refetchSession,
    isSessionRefetching,
    t,
  };
};
