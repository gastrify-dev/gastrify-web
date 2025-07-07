import type { Metadata } from "next";
import Link from "next/link";
import { GalleryVerticalEnd } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app.forgot-password-page");

  return {
    title: t("meta-title"),
    description: t("meta-description"),
  };
}

export default function ForgotPasswordPage() {
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
      <ForgotPasswordForm />
    </div>
  );
}
