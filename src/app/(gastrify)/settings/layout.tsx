import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ScrollArea } from "@/shared/components/ui/scroll-area";
import {
  TypographyH1,
  TypographyMuted,
} from "@/shared/components/ui/typography";

import { SettingsSidebar } from "@/features/settings/components/settings-sidebar";
import { PageWrapper } from "@/features/settings/components/page-wrapper";
import { MobileWrapper } from "@/features/settings/components/mobile-wrapper";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app.settings-layout");

  return {
    title: t("meta-title"),
    description: t("meta-description"),
  };
}

export default async function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const t = await getTranslations("app.settings-layout");

  return (
    <div className="flex h-full flex-col space-y-8">
      <MobileWrapper>
        <div className="space-y-2">
          <TypographyH1>{t("title")}</TypographyH1>

          <TypographyMuted>{t("description")}</TypographyMuted>
        </div>
      </MobileWrapper>

      <div className="flex min-h-0 flex-1 gap-6">
        <SettingsSidebar />

        <PageWrapper>
          <ScrollArea className="h-full flex-1">
            <div className="space-y-8 px-4 pb-16">{children}</div>
          </ScrollArea>
        </PageWrapper>
      </div>
    </div>
  );
}
