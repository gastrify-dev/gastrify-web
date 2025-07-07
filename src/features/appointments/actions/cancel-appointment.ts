"use server";

import { headers } from "next/headers";
import { eq } from "drizzle-orm";

import { auth } from "@/shared/lib/better-auth/server";
import { db } from "@/shared/lib/drizzle/server";
import { appointment } from "@/shared/lib/drizzle/schema";
import type { ActionResponse } from "@/shared/types";
import { tryCatch } from "@/shared/utils/try-catch";

import { cancelAppointmentSchema } from "@/features/appointments/schemas/cancel-appointment";
import type { CancelAppointmentVariables } from "@/features/appointments/types";

export type CancelAppointmentErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "BAD_REQUEST"
  | "INTERNAL_SERVER_ERROR";

export const cancelAppointment = async (
  variables: CancelAppointmentVariables,
): Promise<ActionResponse<null, CancelAppointmentErrorCode>> => {
  //check if user is authenticated

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      data: null,
      error: {
        code: "UNAUTHORIZED",
        message: "You must be logged in to cancel an appointment",
      },
    };
  }

  //parse variables

  const parsedVariables = cancelAppointmentSchema.safeParse(variables);

  if (!parsedVariables.success) {
    return {
      data: null,
      error: {
        code: "BAD_REQUEST",
        message: `Invalid input: ${parsedVariables.error.message}`,
      },
    };
  }

  const { appointmentId } = parsedVariables.data;

  //check if appointment exists

  const { data: existingAppointment, error: existingAppointmentDbError } =
    await tryCatch(
      db.select().from(appointment).where(eq(appointment.id, appointmentId)),
    );

  if (existingAppointmentDbError) {
    console.error(existingAppointmentDbError);

    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
      },
    };
  }

  if (!existingAppointment || existingAppointment.length === 0) {
    return {
      data: null,
      error: {
        code: "NOT_FOUND",
        message: "Appointment not found",
      },
    };
  }

  //check if user is the patient of the appointment

  if (existingAppointment[0].patientId !== session.user.id) {
    return {
      data: null,
      error: {
        code: "FORBIDDEN",
        message: "You can only cancel your own appointments",
      },
    };
  }

  //cancel the appointment

  const { error: cancelAppointmentDbError } = await tryCatch(
    db
      .update(appointment)
      .set({
        status: "available",
        patientId: null,
        type: null,
        location: null,
        meetingLink: null,
      })
      .where(eq(appointment.id, appointmentId)),
  );

  if (cancelAppointmentDbError) {
    console.error(cancelAppointmentDbError);

    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
      },
    };
  }

  return {
    data: null,
    error: null,
  };
};
