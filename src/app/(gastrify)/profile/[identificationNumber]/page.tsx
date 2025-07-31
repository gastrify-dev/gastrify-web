import { headers } from "next/headers";

import { auth } from "@/shared/lib/better-auth/server";

import { isAdmin } from "@/shared/utils/is-admin";
import { redirect } from "next/navigation";

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

  return <div>{identificationNumber}</div>;
}
