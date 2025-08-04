import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/shared/lib/better-auth/server";
import { isAdmin } from "@/shared/utils/is-admin";
import { getUser } from "@/shared/actions/get-user";
import { TypographyH1 } from "@/shared/components/ui/typography";
import { HealthProfileForm } from "@/features/healthProfile/components/health-profile-form";
import { StepperProvider } from "@/features/healthProfile/context/stepper-context";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ identificationNumber: string }>;
}) {
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
    <div className="flex flex-col gap-6">
      <TypographyH1>Profile</TypographyH1>

      <StepperProvider totalSteps={3}>
        <HealthProfileForm userId={userId} />
      </StepperProvider>
    </div>
  );
}
