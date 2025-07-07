import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import { useSession } from "@/shared/hooks/use-session";

import { useUpdatePasswordMutation } from "@/features/settings/hooks/use-update-password-mutation";
import { updatePasswordSchema } from "@/features/settings/schemas/update-password";
import type { UpdatePasswordVariables } from "@/features/settings/types";

export const useUpdatePasswordForm = () => {
  const { isSuccess: isSessionSuccess } = useSession();

  const form = useForm<UpdatePasswordVariables>({
    mode: "onChange",
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const { mutate, isPending, isError } = useUpdatePasswordMutation({
    form,
  });

  const onSubmit = (variables: UpdatePasswordVariables) => mutate(variables);

  const t = useTranslations("features.settings.update-password-form");

  return {
    form,
    onSubmit,
    isPending,
    isError,
    isSessionSuccess,
    t,
  };
};
