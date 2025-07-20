import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import Notifications from "@/features/notifications/components/notifications";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app.notifications-page");

  return {
    title: t("meta-title"),
    description: t("meta-description"),
  };
}

export default function NotificationsPage() {
  return <Notifications />;
}
