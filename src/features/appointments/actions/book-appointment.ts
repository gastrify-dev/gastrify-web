"use server";

import { createZoomMeeting } from "@/shared/lib/zoom/zoom-api";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { es } from "date-fns/locale";
import { format } from "date-fns";

import { db } from "@/shared/lib/drizzle/server";
import { appointment } from "@/shared/lib/drizzle/schema";
import { tryCatch } from "@/shared/utils/try-catch";
import { ActionResponse } from "@/shared/types";
import { resend } from "@/shared/lib/resend/server";
import { auth } from "@/shared/lib/better-auth/server";
import AppointmentEmail from "@/shared/lib/react-email/appointment-email";

import { bookAppointmentSchema } from "@/features/appointments/schemas/book-appointment";
import type { BookAppointmentVariables } from "@/features/appointments/types";
import { generateIcsAttachment } from "@/features/appointments/utils/generate-ics";
import { createNotification } from "@/features/notifications/actions/create-notification";

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
  let zoomMeetingLink: string | undefined = undefined;
  let zoomMeetingId: string | undefined = undefined;
  let locationValue: string | undefined = undefined;

  if (appointmentType === "virtual") {
    const { data: zoomMeeting, error: zoomError } = await tryCatch(
      createZoomMeeting({
        topic: `Cita médica virtual con ${session.user.name}`,
        startTime: existingAppointment[0].start.toISOString(),
        duration: 60,
      }),
    );

    if (zoomMeeting) {
      zoomMeetingLink = zoomMeeting.join_url;
      zoomMeetingId = String(zoomMeeting.id);
      locationValue = zoomMeetingLink;
    } else {
      console.error("Error creando reunión Zoom:", zoomError);
      locationValue = "Clínica Kennedy, Guayaquil, Guayas";
    }
  } else {
    locationValue = "Clínica Kennedy, Guayaquil, Guayas";
  }

  // all good, book appointment
  const { error: bookAppointmentDbError } = await tryCatch(
    db
      .update(appointment)
      .set({
        status: "booked",
        patientId,
        type: appointmentType,
        meetingLink: zoomMeetingLink,
        zoomMeetingId: zoomMeetingId,
        location: locationValue,
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

  const { data: updatedAppointment } = await tryCatch(
    db
      .select()
      .from(appointment)
      .where(eq(appointment.id, appointmentId))
      .limit(1),
  );
  const appointmentData = updatedAppointment?.[0] ?? existingAppointment[0];

  // create in-app notification

  const formattedDate = format(appointmentData.start, "PPPPp", { locale: es });
  await createNotification({
    userId: session.user.id,
    title: "Cita",
    preview: "Tu cita ha sido creada",
    content: `La cita para el día ${formattedDate} ha sido creada exitosamente. Tipo: ${
      appointmentData.type === "virtual" ? "Virtual" : "Presencial"
    }.`,
  });

  // send notification email

  const appointmentDate = appointmentData.start.toLocaleString("es-ES", {
    timeZone: "America/Guayaquil",
  });
  const displayAppointmentType =
    appointmentData.type === "in-person" ? "Presencial" : "Virtual";

  // generate ICS attachment
  const { data: icsData, error: icsError } = await tryCatch(
    generateIcsAttachment({
      start: appointmentData.start,
      end: appointmentData.end,
      title: `Cita médica (${displayAppointmentType})`,
      description: "Cita reservada en Gastrify",
      location:
        appointmentData.type === "virtual"
          ? (appointmentData.meetingLink ??
            "Clínica Kennedy, Guayaquil, Guayas")
          : "Clínica Kennedy, Guayaquil, Guayas",
      id: appointmentData.id,
    }),
  );

  if (icsError) console.error(icsError);

  const { error: emailError } = await tryCatch(
    resend.emails.send({
      from: "Gastrify <mail@gastrify.aragundy.com>",
      to: [session.user.email],
      subject: "Cita reservada",
      react: AppointmentEmail({
        patientName: session.user.name,
        patientEmail: session.user.email,
        appointmentDate,
        appointmentType: appointmentData.type!,
        appointmentLocation: appointmentData.location ?? undefined,
        appointmentUrl: appointmentData.meetingLink ?? undefined,
        action: "booked",
      }),
      attachments: icsData ? [icsData] : undefined,
    }),
  );

  if (emailError) console.error(emailError);

  return {
    data: null,
    error: null,
  };
};
