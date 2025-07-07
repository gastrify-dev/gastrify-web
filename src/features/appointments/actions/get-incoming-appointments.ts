"use server";

import { headers } from "next/headers";
import { eq, and, gte } from "drizzle-orm";

import { auth } from "@/shared/lib/better-auth/server";
import { db } from "@/shared/lib/drizzle/server";
import { appointment, user } from "@/shared/lib/drizzle/schema";
import type { ActionResponse } from "@/shared/types";
import { isAdmin } from "@/shared/utils/is-admin";
import { tryCatch } from "@/shared/utils/try-catch";

import type { IncomingAppointment } from "@/features/appointments/types";

export type IncomingAppointmentsErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "INTERNAL_SERVER_ERROR";

export const getIncomingAppointments = async (): Promise<
  ActionResponse<IncomingAppointment[], IncomingAppointmentsErrorCode>
> => {
  //check if user is authenticated

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session)
    return {
      data: null,
      error: {
        code: "UNAUTHORIZED",
        message: "You must be logged in to view incoming appointments",
      },
    };

  //check if user is an admin

  if (!isAdmin(session.user))
    return {
      data: null,
      error: {
        code: "FORBIDDEN",
        message: "You must be an admin to view incoming appointments",
      },
    };

  //good, get all incoming appointments

  const { data, error } = await tryCatch(
    db
      .select({
        appointment: appointment,
        patient: {
          name: user.name,
          identificationNumber: user.identificationNumber,
          email: user.email,
        },
      })
      .from(appointment)
      .innerJoin(user, eq(appointment.patientId, user.id))
      .where(
        and(eq(appointment.status, "booked"), gte(appointment.end, new Date())),
      ),
  );

  if (error) {
    console.error(error);

    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An error occurred while fetching incoming appointments",
      },
    };
  }

  return {
    data: data,
    error: null,
  };
};
