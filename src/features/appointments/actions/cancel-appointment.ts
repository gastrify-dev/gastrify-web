"use server";

import { headers } from "next/headers";
import { eq } from "drizzle-orm";

import { auth } from "@/shared/lib/better-auth/server";
import { db } from "@/shared/lib/drizzle/server";
import { appointment } from "@/shared/lib/drizzle/schema";
import type { ActionResponse } from "@/shared/types";
import { tryCatch } from "@/shared/utils/try-catch";
import { resend } from "@/shared/lib/resend/server";
import AppointmentEmail from "@/shared/lib/react-email/appointment-email";

import { cancelAppointmentSchema } from "@/features/appointments/schemas/cancel-appointment";
import type { CancelAppointmentVariables } from "@/features/appointments/types";
import { generateIcsAttachment } from "@/features/appointments/utils/generate-ics";

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

  // --- Envío de email de cancelación con ICS usando tryCatch ---
  const appt = existingAppointment[0];
  const patientName = session.user.name || "Paciente";
  const patientEmail = session.user.email;
  const appointmentDate = appt.start.toLocaleString("es-ES", {
    timeZone: "America/Guayaquil",
  });
  // Forzar tipo 'Consulta' para que el SUMMARY sea 'Cita médica (Consulta)'
  const appointmentTypeStr = "Consulta";

  // Generar el ICS primero
  const { data: icsAttachment, error: icsError } = await tryCatch(
    generateIcsAttachment({
      start: appt.start,
      end: appt.end,
      summary: `Cita médica (${appointmentTypeStr})`,
      description: "Cita cancelada en Gastrify",
      location: appt.location || "",
      status: "CANCELLED",
      uid: appt.id,
      method: "CANCEL",
      sequence: 1,
    }),
  );
  if (icsError) {
    console.error(
      "[CANCEL-APPOINTMENT] Error generating ICS attachment:",
      icsError,
    );
    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to generate ICS attachment",
      },
    };
  }
  const { error: emailError } = await tryCatch(
    resend.emails.send({
      from: "Gastrify <mail@gastrify.aragundy.com>",
      to: [patientEmail],
      subject: "Cita cancelada",
      react: AppointmentEmail({
        patientName,
        patientEmail,
        appointmentDate,
        appointmentType: appointmentTypeStr,
        action: "canceled",
      }),
      attachments: [icsAttachment],
    }),
  );

  if (emailError) {
    console.error("[CANCEL-APPOINTMENT] Error enviando email:", emailError);
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
