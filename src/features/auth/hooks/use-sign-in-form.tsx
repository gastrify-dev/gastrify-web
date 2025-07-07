"use client";

import { useState } from "react";
import { IdCardIcon, WandSparklesIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { CredentialsForm } from "@/features/auth/components/credentials-form";
import { MagicLinkForm } from "@/features/auth/components/magic-link-form";

export const useSignInForm = () => {
  const t = useTranslations("features.auth.sign-in-form");
  const [signInMethod, setSignInMethod] = useState<"credentials" | "magicLink">(
    "credentials",
  );

  const toggleSignInMethod = () =>
    setSignInMethod(
      signInMethod === "credentials" ? "magicLink" : "credentials",
    );

  const form =
    signInMethod === "credentials" ? <CredentialsForm /> : <MagicLinkForm />;

  const toggleSignInMethodButtonContent =
    signInMethod === "credentials" ? (
      <>
        <WandSparklesIcon /> {t("magic-link-button")}
      </>
    ) : (
      <>
        <IdCardIcon /> {t("credentials-button")}
      </>
    );

  return {
    form,
    signInMethod,
    setSignInMethod,
    toggleSignInMethod,
    toggleSignInMethodButtonContent,
    t,
  };
};
