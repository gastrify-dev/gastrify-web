import { Dispatch, SetStateAction, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import { twoFactorSchema } from "@/shared/schemas/two-factor";
import type { TwoFactorVariables } from "@/shared/types";

import { useVerifyTotpMutation } from "@/features/settings/hooks/use-verify-totp-mutation";
import { getTxtArrayBuffer } from "@/features/settings/utils/get-txt-array-buffer";

interface Props {
  URI: string;
  setTotpURI: Dispatch<SetStateAction<string>>;
  backupCodes: string[];
  setBackupCodes: Dispatch<SetStateAction<string[]>>;
}

export const useQrCodeDialog = ({
  URI,
  setTotpURI,
  backupCodes,
  setBackupCodes,
}: Props) => {
  const form = useForm<TwoFactorVariables>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      code: "",
    },
  });

  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const dialogCloseRef = useRef<HTMLButtonElement>(null);

  const key = URI ? new URL(URI).searchParams.get("secret")! : "";

  const { mutate, isPending, isError } = useVerifyTotpMutation({
    form,
    setTotpURI,
    setShowBackupCodes,
  });

  const onSubmit = (variables: TwoFactorVariables) =>
    mutate({
      code: variables.code,
    });

  const handleDownloadBackupCodes = () => {
    const buffer = getTxtArrayBuffer(backupCodes);

    const blob = new Blob([buffer], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "stories-backup-codes.txt";
    a.click();

    URL.revokeObjectURL(url);
    setBackupCodes([]);
    setShowBackupCodes(false);
    dialogCloseRef.current?.click();
  };

  const t = useTranslations("features.settings.qr-code-dialog");

  return {
    form,
    onSubmit,
    isPending,
    isError,
    key,
    showBackupCodes,
    setShowBackupCodes,
    handleDownloadBackupCodes,
    dialogCloseRef,
    t,
  };
};
