import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { TypographyH1 } from "@/shared/components/ui/typography";
import { auth } from "@/shared/lib/better-auth/server";

import { HealthProfileForm } from "@/features/healthProfile/components/health-profile-form";
import { StepperProvider } from "@/features/healthProfile/context/stepper-context";
import PatientsTable from "@/features/healthProfile/components/patients-table";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app.profile-page");

  return {
    title: t("meta-title"),
    description: t("meta-description"),
  };
}

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return redirect("/sign-in");

  if (session.user.role === "admin") return redirect("/admin");

  return (
    <div className="flex flex-col gap-6">
      <TypographyH1>Profile</TypographyH1>

      <StepperProvider totalSteps={3}>
        <HealthProfileForm userId={session.user.id} />
      </StepperProvider>
    </div>
  );
}
