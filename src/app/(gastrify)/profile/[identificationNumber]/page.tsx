import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { auth } from "@/shared/lib/better-auth/server";
import { isAdmin } from "@/shared/utils/is-admin";
import { getUser } from "@/shared/actions/get-user";
import { TypographyH1 } from "@/shared/components/ui/typography";

import { HealthProfileForm } from "@/features/healthProfile/components/health-profile-form";
import { StepperProvider } from "@/features/healthProfile/context/stepper-context";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app.profile-page");

  return {
    title: t("meta-title"),
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ identificationNumber: string }>;
}) {
  const t = await getTranslations("app.profile-page");
  const { identificationNumber } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return redirect("/sign-in");

  if (!isAdmin(session.user)) return redirect("/profile");

  const { data, error } = await getUser({
    identificationNumber: identificationNumber,
  });

  if (error) return redirect("/home");

  const userId = data.id;

  return (
    <div className="flex h-full min-h-svh flex-col gap-6 overflow-hidden">
      <TypographyH1>{t("title")}</TypographyH1>

      <div className="flex-1 overflow-hidden">
        <StepperProvider totalSteps={3}>
          <HealthProfileForm userId={userId} />
        </StepperProvider>
      </div>
    </div>
  );
}
