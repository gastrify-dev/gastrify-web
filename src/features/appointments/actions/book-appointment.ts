"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/shared/lib/drizzle/server";
import { appointment } from "@/shared/lib/drizzle/schema";
import { tryCatch } from "@/shared/utils/try-catch";
import { ActionResponse } from "@/shared/types";
import { auth } from "@/shared/lib/better-auth/server";

import { bookAppointmentSchema } from "@/features/appointments/schemas/book-appointment";
import type { BookAppointmentVariables } from "@/features/appointments/types";

export type BookAppointmentErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "BAD_REQUEST"
  | "NOT_FOUND"
  | "ALREADY_BOOKED"
  | "PAST_APPOINTMENT"
  | "INTERNAL_SERVER_ERROR";

export const bookAppointment = async (
  variables: BookAppointmentVariables,
): Promise<ActionResponse<null, BookAppointmentErrorCode>> => {
  // check if user is authenticated

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      data: null,
      error: {
        code: "UNAUTHORIZED",
        message: "You must be logged in to book an appointment",
      },
    };
  }

  // parse values

  const parsedVariables = bookAppointmentSchema.safeParse(variables);

  if (!parsedVariables.success) {
    return {
      data: null,
      error: {
        code: "BAD_REQUEST",
        message: "Invalid input",
      },
    };
  }

  const { appointmentId, patientId, appointmentType } = parsedVariables.data;

  // check if patient is the same as the one who is booking the appointment

  if (session.user.id !== patientId) {
    return {
      data: null,
      error: {
        code: "FORBIDDEN",
        message: "You can only book your own appointments",
      },
    };
  }

  // check if appointment exists

  const { data: existingAppointment, error: existingAppointmentDbError } =
    await tryCatch(
      db
        .select()
        .from(appointment)
        .where(eq(appointment.id, appointmentId))
        .limit(1),
    );

  if (existingAppointmentDbError) {
    console.error(existingAppointmentDbError);

    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred",
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

  // if it exists, check if it's available

  if (existingAppointment[0].status !== "available") {
    return {
      data: null,
      error: {
        code: "ALREADY_BOOKED",
        message: "Appointment is not available",
      },
    };
  }

  // check if appointment is in the past

  if (existingAppointment[0].start < new Date()) {
    return {
      data: null,
      error: {
        code: "PAST_APPOINTMENT",
        message: "Appointment is no longer available",
      },
    };
  }

  // all good, book appointment

  const { error: bookAppointmentDbError } = await tryCatch(
    db
      .update(appointment)
      .set({
        status: "booked",
        patientId,
        type: appointmentType,
      })
      .where(eq(appointment.id, appointmentId)),
  );

  if (bookAppointmentDbError) {
    console.error(bookAppointmentDbError);

    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred",
      },
    };
  }

  return {
    data: null,
    error: null,
  };
};
