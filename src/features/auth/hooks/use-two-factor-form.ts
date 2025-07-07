import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import { twoFactorSchema } from "@/shared/schemas/two-factor";
import type { TwoFactorVariables } from "@/shared/types";

import { useTwoFactorMutation } from "@/features/auth/hooks/use-two-factor-mutation";

export const useTwoFactorForm = () => {
  const form = useForm<TwoFactorVariables>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      code: "",
    },
  });

  const { mutate, isPending } = useTwoFactorMutation({ form });

  const onSubmit = (variables: TwoFactorVariables) => mutate(variables);

  const t = useTranslations("features.auth.two-factor-form");

  return { form, onSubmit, isPending, t };
};
