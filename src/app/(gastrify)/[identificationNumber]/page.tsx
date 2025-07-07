import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import {
  TypographyH1,
  TypographyMuted,
} from "@/shared/components/ui/typography";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app.profile-page");

  return {
    title: t("meta-title"),
    description: t("meta-description"),
  };
}

export default async function ProfilePage({}: {
  params: Promise<{ identificationNumber: string }>;
}) {
  // const { identificationNumber } = await params;

  return (
    <div className="flex flex-col gap-6">
      <TypographyH1>Profile</TypographyH1>

      <div className="relative mx-auto aspect-square w-full max-w-sm">
        <Image src="/coming-soon.svg" alt="Coming soon" fill />
      </div>

      <TypographyMuted className="text-center">Coming soon...</TypographyMuted>
    </div>
  );
}
