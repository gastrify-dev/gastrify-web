import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { GalleryVerticalEnd } from "lucide-react";

import { TwoFactorForm } from "@/features/auth/components/two-factor-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app.two-factor-page");

  return {
    title: "Gastrify | 2FA",
    description: t("meta-description"),
  };
}

export default function TwoFactorPage() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Link
        href="/"
        className="flex items-center gap-2 self-center font-medium"
      >
        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
          <GalleryVerticalEnd className="size-4" />
        </div>
        Gastrify
      </Link>

      <TwoFactorForm />
    </div>
  );
}
