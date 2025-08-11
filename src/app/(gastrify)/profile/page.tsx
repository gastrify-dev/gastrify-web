import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/shared/lib/better-auth/server";
import { TypographyH1 } from "@/shared/components/ui/typography";

import { HealthProfileForm } from "@/features/healthProfile/components/health-profile-form";
import { StepperProvider } from "@/features/healthProfile/context/stepper-context";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app.profile-page");

  return {
    title: t("meta-title"),
    description: t("meta-description"),
  };
}

export default async function ProfilePage() {
  const t = await getTranslations("app.profile-page");
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return redirect("/sign-in");

  if (session.user.role === "admin") return redirect("/admin");

  return (
    <div className="flex h-full min-h-svh flex-col gap-6 overflow-hidden">
      <TypographyH1>{t("title")}</TypographyH1>

      <div className="flex-1 overflow-hidden">
        <StepperProvider totalSteps={3}>
          <HealthProfileForm userId={session.user.id} />
        </StepperProvider>
      </div>
    </div>
  );
}
