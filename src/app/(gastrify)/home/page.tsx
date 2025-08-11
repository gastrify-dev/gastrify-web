import type { Metadata } from "next";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { and, count, eq } from "drizzle-orm";

import { TypographyH1 } from "@/shared/components/ui/typography";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { auth } from "@/shared/lib/better-auth/server";
import { db } from "@/shared/lib/drizzle/server";
import { appointment, user } from "@/shared/lib/drizzle/schema";

import { getAllAppointments } from "@/features/appointments/actions/get-all-appointments";
import { getIncomingAppointments } from "@/features/appointments/actions/get-incoming-appointments";
import { getUserAppointments } from "@/features/appointments/actions/get-user-appointments";
import { isProfileCompleted } from "@/shared/actions/profile-completed";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app.home-page");

  return {
    title: t("meta-title"),
    description: t("meta-description"),
  };
}

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const isAdmin = session?.user.role === "admin";

  const now = new Date();

  let profileCompleted = null as boolean | null;
  let totalAppointments = 0;
  let incomingAppointments = 0;
  let totalUsers = 0;
  let totalPatients = 0;
  let virtualAppointments = 0;
  let inPersonAppointments = 0;

  if (session) {
    if (isAdmin) {
      const [allAppointmentsRes, incomingRes, usersCountRows, adminsCountRows] =
        await Promise.all([
          getAllAppointments(),
          getIncomingAppointments(),
          db.select({ value: count() }).from(user),
          db
            .select({ value: count() })
            .from(user)
            .where(eq(user.role, "admin")),
        ]);

      totalAppointments = allAppointmentsRes.data?.length ?? 0;
      incomingAppointments = incomingRes.data?.length ?? 0;
      totalUsers = usersCountRows?.[0]?.value ?? 0;
      const totalAdmins = adminsCountRows?.[0]?.value ?? 0;
      totalPatients = totalUsers - totalAdmins;

      const [virtualRows, inPersonRows] = await Promise.all([
        db
          .select({ value: count() })
          .from(appointment)
          .where(
            and(
              eq(appointment.status, "booked"),
              eq(appointment.type, "virtual"),
            ),
          ),
        db
          .select({ value: count() })
          .from(appointment)
          .where(
            and(
              eq(appointment.status, "booked"),
              eq(appointment.type, "in-person"),
            ),
          ),
      ]);

      virtualAppointments = virtualRows?.[0]?.value ?? 0;
      inPersonAppointments = inPersonRows?.[0]?.value ?? 0;
    } else {
      const [userAppointmentsRes, profileRes] = await Promise.all([
        getUserAppointments(session.user.id),
        isProfileCompleted({ id: session.user.id }),
      ]);

      const myAppointments = userAppointmentsRes.data ?? [];
      totalAppointments = myAppointments.length;
      incomingAppointments = myAppointments.filter((a) => a.end >= now).length;
      profileCompleted = profileRes.data;

      virtualAppointments = myAppointments.filter(
        (a) => a.type === "virtual",
      ).length;
      inPersonAppointments = myAppointments.filter(
        (a) => a.type === "in-person",
      ).length;
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <TypographyH1>Dashboard</TypographyH1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-4xl">
          <CardHeader className="text-center">
            <CardTitle>Total appointments</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold">{totalAppointments}</div>
          </CardContent>
        </Card>

        <Card className="rounded-4xl">
          <CardHeader className="text-center">
            <CardTitle>Incoming appointments</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold">{incomingAppointments}</div>
          </CardContent>
        </Card>

        <Card className="rounded-4xl lg:col-span-2">
          <CardHeader className="text-center">
            <CardTitle>Appointments by type</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const total = virtualAppointments + inPersonAppointments;
              const vPct =
                total > 0 ? Math.round((virtualAppointments / total) * 100) : 0;
              const iPct = total > 0 ? 100 - vPct : 0;
              return (
                <div className="flex flex-col gap-3">
                  <div className="bg-muted h-3 w-full overflow-hidden rounded-full">
                    <div
                      className="h-3 bg-sky-500"
                      style={{ width: `${vPct}%` }}
                    />
                    <div
                      className="-mt-3 h-3 bg-emerald-500"
                      style={{ width: `${iPct}%` }}
                    />
                  </div>
                  <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-3 w-3 rounded-full bg-sky-500" />
                      <span>Virtual: {virtualAppointments}</span>
                      <span className="text-xs">({vPct}%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-3 w-3 rounded-full bg-emerald-500" />
                      <span>In-person: {inPersonAppointments}</span>
                      <span className="text-xs">({iPct}%)</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>

        {!isAdmin && (
          <Card className="rounded-4xl">
            <CardHeader className="text-center">
              <CardTitle>Profile completion</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold">
                {profileCompleted === null
                  ? "-"
                  : profileCompleted
                    ? "Completed"
                    : "Incomplete"}
              </div>
            </CardContent>
          </Card>
        )}

        {isAdmin && (
          <>
            <Card className="rounded-4xl">
              <CardHeader className="text-center">
                <CardTitle>Total users</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold">{totalUsers}</div>
              </CardContent>
            </Card>

            <Card className="rounded-4xl">
              <CardHeader className="text-center">
                <CardTitle>Total patients</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold">{totalPatients}</div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
