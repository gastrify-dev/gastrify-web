"use server";

import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { auth } from "@/shared/lib/better-auth/server";
import { db } from "@/shared/lib/drizzle/server";
import { appointment, user } from "@/shared/lib/drizzle/schema";
import type { ActionResponse } from "@/shared/types";
import { isAdmin } from "@/shared/utils/is-admin";
import { tryCatch } from "@/shared/utils/try-catch";
import AppointmentEmail from "@/shared/lib/react-email/appointment-email";
import { resend } from "@/shared/lib/resend/server";

import { deleteMeeting } from "@/features/appointments/actions/delete-meeting";
import { deleteAppointmentSchema } from "@/features/appointments/schemas/delete-appointment";
import type { DeleteAppointmentVariables } from "@/features/appointments/types";
import { createNotification } from "@/features/notifications/actions/create-notification";

export type DeleteAppointmentErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "BAD_REQUEST"
  | "INTERNAL_SERVER_ERROR";

export async function deleteAppointment(
  variables: DeleteAppointmentVariables,
): Promise<ActionResponse<{ id: string }, DeleteAppointmentErrorCode>> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session)
    return {
      data: null,
      error: {
        code: "UNAUTHORIZED",
        message: "You must be logged in to delete an appointment",
      },
    };

  //parse variables

  const parsedVariables = deleteAppointmentSchema.safeParse(variables);

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

  if (!isAdmin(session.user))
    return {
      data: null,
      error: {
        code: "FORBIDDEN",
        message: "You must be an admin to delete an appointment",
      },
    };

  const { data, error } = await tryCatch(
    db.delete(appointment).where(eq(appointment.id, appointmentId)).returning(),
  );

  if (error) {
    console.error(error);

    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred",
      },
    };
  }

  if (!data || data.length === 0) {
    return {
      data: null,
      error: {
        code: "NOT_FOUND",
        message: "Appointment not found",
      },
    };
  }

  const appointmentData = data[0];

  if (appointmentData.patientId && appointmentData.status === "booked") {
    if (appointmentData.meetingLink) {
      const meetingId = (
        appointmentData.meetingLink.split("/").pop() as string
      ).split("?")[0];

      const { error: zoomDeleteError } = await deleteMeeting({
        meetingId,
      });

      if (zoomDeleteError)
        console.error("Error deleting meeting", zoomDeleteError);
    }

    const { data: patientData } = await tryCatch(
      db
        .select({
          name: user.name,
          email: user.email,
        })
        .from(user)
        .where(eq(user.id, appointmentData.patientId)),
    );

    if (patientData && patientData.length === 1) {
      const patient = patientData[0];

      // create in-app notification

      const formattedDate = format(appointmentData.start, "PPPPp", {
        locale: es,
      });

      await createNotification({
        userId: appointmentData.patientId,
        title: "Cita",
        preview: "Tu cita ha sido cancelada",
        content: `La cita para el día ${formattedDate} ha sido cancelada exitosamente. Tipo: ${
          appointmentData.type === "virtual" ? "Virtual" : "Presencial"
        }.`,
      });

      // send notification email

      const appointmentDate = appointmentData.start.toLocaleString("es-ES", {
        timeZone: "America/Guayaquil",
      });

      const { error: emailError } = await tryCatch(
        resend.emails.send({
          from: "Gastrify <mail@gastrify.aragundy.com>",
          to: [patient.email],
          subject: "Cita cancelada",
          react: AppointmentEmail({
            patientName: patient.name,
            patientEmail: patient.email,
            appointmentDate,
            appointmentType: appointmentData.type!,
            appointmentLocation: appointmentData.location ?? undefined,
            appointmentUrl: appointmentData.meetingLink ?? undefined,
            action: "canceled",
          }),
        }),
      );

      if (emailError) console.error(emailError);
    }
  }

  return {
    data: {
      id: appointmentId,
    },
    error: null,
  };
}
