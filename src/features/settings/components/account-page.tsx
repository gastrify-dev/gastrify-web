import { getTranslations } from "next-intl/server";

import { SettingsPageHeader } from "@/features/settings/components/settings-page-header";
import { UpdateEmailForm } from "@/features/settings/components/update-email-form";
import { UpdateNameForm } from "@/features/settings/components/update-name-form";
import { UpdateIdentificationNumberForm } from "@/features/settings/components/update-identification-number-form";
import { UpdateLanguageForm } from "@/features/settings/components/update-language-form";

export async function SettingsAccountPage() {
  const t = await getTranslations("features.settings.account-page");

  return (
    <>
      <SettingsPageHeader title={t("title")} description={t("description")} />

      <UpdateNameForm />
      <UpdateIdentificationNumberForm />
      <UpdateEmailForm />
      <UpdateLanguageForm />
    </>
  );
}
