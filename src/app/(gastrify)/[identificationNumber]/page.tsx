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
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    console.log("No session found - user not logged in");
    return (
      <div className="flex flex-col gap-6">
        <TypographyH1>Profile</TypographyH1>
        <TypographyMuted>Please log in to view your profile</TypographyMuted>
      </div>
    );
  }

  const { data: userProfile, error } = await getUser({
    id: session.user.id,
  });

  console.log(userProfile);

  return (
    <div className="flex flex-col gap-6">
      <TypographyH1>Profile</TypographyH1>

      <HealthProfileForm />
    </div>
  );
}
