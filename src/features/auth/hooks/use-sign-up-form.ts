import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import { useSignUpMutation } from "@/features/auth/hooks/use-sign-up-mutation";
import { signUpSchema } from "@/features/auth/schemas/sign-up";
import type { SignUpVariables } from "@/features/auth/types";

export const useSignUpForm = () => {
  const form = useForm<SignUpVariables>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      identificationNumber: "",
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useSignUpMutation({
    form,
  });

  const onSubmit = (variables: SignUpVariables) => mutate(variables);

  const t = useTranslations("features.auth.sign-up-form");

  return {
    form,
    onSubmit,
    isPending,
    t,
  };
};
