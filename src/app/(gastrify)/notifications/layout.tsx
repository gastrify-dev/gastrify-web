import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { TypographyH1 } from "@/shared/components/ui/typography";

import { NotificationsSidebar } from "@/features/notifications/components/notifications-sidebar";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app.notifications-layout");

  return {
    title: t("meta-title"),
    description: t("meta-description"),
  };
}

export default async function NotificationsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const t = await getTranslations("app.notifications-layout");

  return (
    <div className="flex h-full w-full flex-col gap-6">
      <TypographyH1>{t("title")}</TypographyH1>

      <div className="flex h-full w-full flex-1 gap-6">
        <NotificationsSidebar />

        {children}
      </div>
    </div>
  );
}
