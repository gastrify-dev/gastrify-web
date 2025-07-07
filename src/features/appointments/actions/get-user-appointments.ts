"use server";

import { headers } from "next/headers";
import { eq, asc, and } from "drizzle-orm";

import { auth } from "@/shared/lib/better-auth/server";
import { db } from "@/shared/lib/drizzle/server";
import { appointment } from "@/shared/lib/drizzle/schema";
import type { ActionResponse } from "@/shared/types";
import { tryCatch } from "@/shared/utils/try-catch";

import type { Appointment } from "@/features/appointments/types";

export type UserAppointmentsErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "INTERNAL_SERVER_ERROR";

export const getUserAppointments = async (
  userId: string,
): Promise<ActionResponse<Appointment[], UserAppointmentsErrorCode>> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session)
    return {
      data: null,
      error: {
        code: "UNAUTHORIZED",
        message: "You must be logged in to get user appointments",
      },
    };

  if (session.user.id !== userId)
    return {
      data: null,
      error: {
        code: "FORBIDDEN",
        message: "User can only see their own appointments",
      },
    };

  const { data, error } = await tryCatch(
    db
      .select()
      .from(appointment)
      .where(
        and(
          eq(appointment.patientId, userId),
          eq(appointment.status, "booked"),
        ),
      )
      .orderBy(asc(appointment.start)),
  );

  if (error) {
    console.error(error);

    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An error occurred while fetching user appointments",
      },
    };
  }

  return {
    data,
    error: null,
  };
};
