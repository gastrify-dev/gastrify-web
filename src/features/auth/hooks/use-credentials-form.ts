import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import { credentialsSchema } from "@/features/auth/schemas/credentials";
import type { CredentialsVariables } from "@/features/auth/types";

import { useCredentialsMutation } from "@/features/auth/hooks/use-credentials-mutation";

export const useCredentialsForm = () => {
  const form = useForm<CredentialsVariables>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useCredentialsMutation({
    form,
  });

  const onSubmit = (variables: CredentialsVariables) => mutate(variables);

  const t = useTranslations("features.auth.credentials-form");

  return { form, onSubmit, isPending, t };
};
