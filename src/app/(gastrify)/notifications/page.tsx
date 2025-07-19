import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import NotificationsClient from "@/features/notifications/components/notifications-client";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app.notifications-page");

  return {
    title: t("meta-title"),
    description: t("meta-description"),
  };
}

export default function NotificationsPage() {
  return <NotificationsClient />;
}
