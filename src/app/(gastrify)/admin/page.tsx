import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import {
  TypographyH1,
  TypographyMuted,
} from "@/shared/components/ui/typography";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { auth } from "@/shared/lib/better-auth/server";

import { DataTable } from "@/features/admin/components/data-table";

export const metadata: Metadata = {
  title: "Gastrify | Admin",
};

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return redirect("/sign-in");

  if (session.user.role !== "admin") return redirect("/home");

  return (
    <ScrollArea className="h-full w-full">
      <div className="flex flex-col gap-6 pr-4 pb-16 pl-1">
        <div className="space-y-2">
          <TypographyH1>Admin</TypographyH1>

          <TypographyMuted>
            Manage users, roles, and permissions across your application. 🌴
          </TypographyMuted>
        </div>

        <DataTable />
      </div>
    </ScrollArea>
  );
}
