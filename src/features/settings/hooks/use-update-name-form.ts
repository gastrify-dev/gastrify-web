import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import { useSession } from "@/shared/hooks/use-session";

import { useUpdateNameMutation } from "@/features/settings/hooks/use-update-name-mutation";
import { updateNameSchema } from "@/features/settings/schemas/update-name";
import type { UpdateNameVariables } from "@/features/settings/types";

export const useUpdateNameForm = () => {
  const {
    data: session,
    isSuccess: isSessionSuccess,
    isLoading: isSessionLoading,
    isError: isSessionError,
    refetch: refetchSession,
    isRefetching: isSessionRefetching,
  } = useSession();

  const form = useForm<UpdateNameVariables>({
    resolver: zodResolver(updateNameSchema),
    values: {
      name: session?.user.name ?? "",
    },
  });

  const { mutate, isPending, isError } = useUpdateNameMutation({ form });

  const { isDirty, isValid } = form.formState;

  const canSubmit =
    isDirty && isValid && form.watch("name").trim() !== session?.user.name;

  const onSubmit = (variables: UpdateNameVariables) => mutate(variables);

  const t = useTranslations("features.settings.update-name-form");

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
