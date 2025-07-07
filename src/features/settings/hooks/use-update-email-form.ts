import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import { useSession } from "@/shared/hooks/use-session";

import { useUpdateEmailMutation } from "@/features/settings/hooks/use-update-email-mutation";
import { updateEmailSchema } from "@/features/settings/schemas/update-email";
import type { UpdateEmailVariables } from "@/features/settings/types";

export const useUpdateEmailForm = () => {
  const {
    data: session,
    isSuccess: isSessionSuccess,
    isLoading: isSessionLoading,
    isError: isSessionError,
    refetch: refetchSession,
    isRefetching: isSessionRefetching,
  } = useSession();

  const form = useForm<UpdateEmailVariables>({
    resolver: zodResolver(updateEmailSchema),
    values: {
      email: session?.user.email ?? "",
    },
  });

  const { mutate, isPending, isError } = useUpdateEmailMutation({
    form,
  });

  const { isDirty, isValid } = form.formState;

  const canSubmit =
    isDirty && isValid && form.watch("email").trim() !== session?.user.email;

  const onSubmit = (values: UpdateEmailVariables) => mutate(values);

  const t = useTranslations("features.settings.update-email-form");

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
