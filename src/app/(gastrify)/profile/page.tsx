import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import {
  TypographyH1,
  TypographyMuted,
} from "@/shared/components/ui/typography";
import { auth } from "@/shared/lib/better-auth/server";
import { headers } from "next/headers";
import { getUser } from "@/shared/actions/get-user";

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
  return (
    <div className="flex flex-col gap-6">
      <TypographyH1>Profile</TypographyH1>

      <StepperProvider totalSteps={3}>
        <HealthProfileForm />
      </StepperProvider>
    </div>
  );
}
