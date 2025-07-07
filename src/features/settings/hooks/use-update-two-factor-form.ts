import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import { useSession } from "@/shared/hooks/use-session";

import { useEnable2FAMutation } from "@/features/settings/hooks/use-enable-2fa-mutation";
import { useDisable2FAMutation } from "@/features/settings/hooks/use-disable-2fa-mutation";
import { updateTwoFactorSchema } from "@/features/settings/schemas/update-two-factor";
import type { UpdateTwoFactorVariables } from "@/features/settings/types";

export const useUpdateTwoFactorForm = () => {
  const {
    data: session,
    isSuccess: isSessionSuccess,
    isLoading: isSessionLoading,
    isError: isSessionError,
    refetch: refetchSession,
    isRefetching: isSessionRefetching,
  } = useSession();

  const form = useForm<UpdateTwoFactorVariables>({
    resolver: zodResolver(updateTwoFactorSchema),
    values: {
      enable2FA: !!session?.user.twoFactorEnabled,
      password: "",
    },
  });

  const [totpURI, setTotpURI] = useState<string>("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const dialogTriggerRef = useRef<HTMLButtonElement>(null);

  const {
    mutate: enable2FA,
    isPending: isEnable2FAPending,
    isError: isEnable2FAError,
  } = useEnable2FAMutation({
    form,
    setTotpURI,
    setBackupCodes,
    dialogTriggerRef,
  });

  const {
    mutate: disable2FA,
    isPending: isDisable2FAPending,
    isError: isDisable2FAError,
  } = useDisable2FAMutation({
    form,
  });

  function onSubmit(variables: UpdateTwoFactorVariables) {
    if (variables.enable2FA)
      return enable2FA({
        password: variables.password,
      });

    if (!variables.enable2FA)
      return disable2FA({
        password: variables.password,
      });
  }

  const t = useTranslations("features.settings.update-two-factor-form");

  return {
    form,
    onSubmit,
    isPending: isEnable2FAPending || isDisable2FAPending,
    isError: isEnable2FAError || isDisable2FAError,
    isSessionSuccess,
    isSessionLoading,
    isSessionError,
    refetchSession,
    isSessionRefetching,
    totpURI,
    setTotpURI,
    backupCodes,
    setBackupCodes,
    dialogTriggerRef,
    t,
  };
};
