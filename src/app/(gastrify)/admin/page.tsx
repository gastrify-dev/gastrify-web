import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";

import {
  TypographyH1,
  TypographyMuted,
} from "@/shared/components/ui/typography";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { auth } from "@/shared/lib/better-auth/server";

import { DataTable } from "@/features/admin/components/data-table";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app.admin-page");
  return {
    title: t("meta-title"),
    description: t("meta-description"),
  };
}

export default async function AdminPage() {
  const t = await getTranslations("app.admin-page");
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return redirect("/sign-in");

  if (session.user.role !== "admin") return redirect("/home");

  return (
    <ScrollArea className="h-full w-full">
      <div className="flex flex-col gap-6 pr-4 pb-16 pl-1">
        <div className="space-y-2">
          <TypographyH1>{t("title")}</TypographyH1>

          <TypographyMuted>{t("description")}</TypographyMuted>
        </div>

        <DataTable />
      </div>
    </ScrollArea>
  );
}
