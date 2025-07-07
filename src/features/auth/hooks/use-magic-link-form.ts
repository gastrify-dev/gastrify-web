import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import { magicLinkSchema } from "@/features/auth/schemas/magic-link";
import { useMagicLinkMutation } from "@/features/auth/hooks/use-magic-link-mutation";
import type { MagicLinkVariables } from "@/features/auth/types";

export const useMagicLinkForm = () => {
  const form = useForm<MagicLinkVariables>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending } = useMagicLinkMutation({ form });

  const onSubmit = (variables: MagicLinkVariables) => mutate(variables);

  const t = useTranslations("features.auth.magic-link-form");

  return { form, onSubmit, isPending, t };
};
