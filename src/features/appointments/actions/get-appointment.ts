"use server";

import { headers } from "next/headers";
import { eq } from "drizzle-orm";

import { db } from "@/shared/lib/drizzle/server";
import { appointment, user } from "@/shared/lib/drizzle/schema";
import { auth } from "@/shared/lib/better-auth/server";
import type { ActionResponse } from "@/shared/types";

import type { Appointment } from "@/features/appointments/types";
import { isAdmin } from "@/shared/utils/is-admin";
import { tryCatch } from "@/shared/utils/try-catch";

type ErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "INTERNAL_SERVER_ERROR";

type CreatedAppointment = Omit<Appointment, "createdAt" | "patientId"> & {
  patientIdentificationNumber: string | null;
};

export async function getAppointment(
  id: string,
): Promise<ActionResponse<CreatedAppointment, ErrorCode>> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      data: null,
      error: {
        code: "UNAUTHORIZED",
        message: "You must be logged in to get an appointment",
      },
    };
  }

  if (!isAdmin(session.user))
    return {
      data: null,
      error: { code: "FORBIDDEN", message: "User not authorized" },
    };

  const { data, error } = await tryCatch(
    db
      .select({
        id: appointment.id,
        start: appointment.start,
        end: appointment.end,
        status: appointment.status,
        type: appointment.type,
        patientIdentificationNumber: user.identificationNumber,
        meetingLink: appointment.meetingLink,
        location: appointment.location,
      })
      .from(appointment)
      .leftJoin(user, eq(appointment.patientId, user.id))
      .where(eq(appointment.id, id)),
  );

  if (error) {
    console.error(error);

    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching appointment",
      },
    };
  }

  if (data.length === 0)
    return {
      data: null,
      error: { code: "NOT_FOUND", message: "Appointment not found" },
    };

  return {
    data: data[0],
    error: null,
  };
}
