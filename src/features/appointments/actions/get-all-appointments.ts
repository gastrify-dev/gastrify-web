"use server";

import { headers } from "next/headers";
import { gte, sql } from "drizzle-orm";

import { auth } from "@/shared/lib/better-auth/server";
import { db } from "@/shared/lib/drizzle/server";
import { appointment } from "@/shared/lib/drizzle/schema";
import type { ActionResponse } from "@/shared/types";
import { tryCatch } from "@/shared/utils/try-catch";

import type { CalendarEvent, EventColor } from "@/features/appointments/types";

type ErrorCode = "UNAUTHORIZED" | "INTERNAL_SERVER_ERROR";

export async function getAllAppointments(): Promise<
  ActionResponse<CalendarEvent[], ErrorCode>
> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      data: null,
      error: {
        code: "UNAUTHORIZED",
        message: "You must be logged in to get all appointments",
      },
    };
  }

  const { data, error } = await tryCatch(
    db
      .select({
        id: appointment.id,
        title: appointment.status,
        start: appointment.start,
        end: appointment.end,
        color: sql<EventColor>`CASE 
          WHEN ${appointment.status} = 'available' THEN 'emerald'
          WHEN ${appointment.status} = 'booked' THEN 'sky'
          ELSE 'amber'
        END`.as("color"),
      })
      .from(appointment)
      .where(
        session.user.role === "admin"
          ? undefined
          : gte(appointment.start, new Date()),
      ),
  );

  if (error) {
    console.error(error);

    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Error getting appointments",
      },
    };
  }

  return { data, error: null };
}
