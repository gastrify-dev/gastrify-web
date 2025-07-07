import { useTranslations } from "next-intl";

import { SettingsPageHeader } from "@/features/settings/components/settings-page-header";
import { UpdateNotificationsForm } from "@/features/settings/components/update-notifications-form";

export default function SettingsNotificationsPage() {
  const t = useTranslations("app.settings-notifications-page");

  return (
    <>
      <SettingsPageHeader title={t("title")} description={t("description")} />

      <UpdateNotificationsForm />
    </>
  );
}
