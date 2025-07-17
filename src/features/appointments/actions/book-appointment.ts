"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/shared/lib/drizzle/server";
import { appointment, user } from "@/shared/lib/drizzle/schema";
import { tryCatch } from "@/shared/utils/try-catch";
import { ActionResponse } from "@/shared/types";
import { auth } from "@/shared/lib/better-auth/server";

import { formatAppointmentDateTime } from "../utils/format-appointment-date-time";
import { sendAppointmentConfirmation } from "./send-appointment-confirmation";
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

  if (session.user.id !== patientId) {
    return {
      data: null,
      error: {
        code: "FORBIDDEN",
        message: "You can only book your own appointments",
      },
    };
  }

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

  if (existingAppointment[0].status !== "available") {
    return {
      data: null,
      error: {
        code: "ALREADY_BOOKED",
        message: "Appointment is not available",
      },
    };
  }

  if (existingAppointment[0].start < new Date()) {
    return {
      data: null,
      error: {
        code: "PAST_APPOINTMENT",
        message: "Appointment is no longer available",
      },
    };
  }

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

  const { data: userData, error: userDbError } = await tryCatch(
    db.select().from(user).where(eq(user.id, patientId)).limit(1),
  );

  if (userDbError) {
    console.error("Error fetching user data:", userDbError);
    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred",
      },
    };
  }

  if (!userData || userData.length === 0) {
    return {
      data: null,
      error: {
        code: "NOT_FOUND",
        message: "User not found",
      },
    };
  }

  const patient = userData[0];
  const appointmentData = existingAppointment[0];

  const { data: formatted, error: formatError } = await tryCatch(
    Promise.resolve(
      formatAppointmentDateTime(
        appointmentData.start,
        patient.language as "en" | "es",
      ),
    ),
  );
  if (formatError) {
    console.error("Error formatting appointment date/time:", formatError);
    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred",
      },
    };
  }
  const appointmentDate = formatted.date;
  const appointmentTime = formatted.time;

  const { data: durationMinutes, error: durationError } = await tryCatch(
    Promise.resolve(
      Math.round(
        (appointmentData.end.getTime() - appointmentData.start.getTime()) /
          (1000 * 60),
      ),
    ),
  );
  if (durationError) {
    console.error("Error calculating appointment duration:", durationError);
    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred",
      },
    };
  }

  const { error: emailError } = await tryCatch(
    sendAppointmentConfirmation({
      to: patient.email,
      patientName: patient.name,
      appointmentId: appointmentData.id,
      appointmentDate,
      appointmentTime,
      appointmentType: appointmentData.type || "in-person",
      location: appointmentData.location || undefined,
      meetingLink: appointmentData.meetingLink || undefined,
      language: patient.language as "en" | "es",
      startDate: appointmentData.start,
      durationMinutes,
    }),
  );
  if (emailError) {
    console.error("Failed to send appointment confirmation email:", emailError);
  } else {
    console.log("Appointment confirmation email sent successfully");
  }

  return {
    data: null,
    error: null,
  };
};
