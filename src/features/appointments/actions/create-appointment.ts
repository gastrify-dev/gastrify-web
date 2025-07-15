"use server";

import { headers } from "next/headers";
import { generateId } from "better-auth";
import { and, eq, gte, lte } from "drizzle-orm";

import { auth } from "@/shared/lib/better-auth/server";
import { db } from "@/shared/lib/drizzle/server";
import { appointment, user } from "@/shared/lib/drizzle/schema";
import type { ActionResponse } from "@/shared/types";
import { isAdmin } from "@/shared/utils/is-admin";
import { tryCatch } from "@/shared/utils/try-catch";
import { sendAppointmentConfirmation } from "@/shared/lib/react-email/send-appointment-confirmation";
import { formatAppointmentDateTime } from "@/shared/lib/react-email/send-appointment-confirmation";

import type {
  Appointment,
  CreateAppointmentVariables,
  IncomingAppointment,
} from "@/features/appointments/types";
import { createAppointmentSchema } from "@/features/appointments/schemas/create-appointment";

export type CreateAppointmentErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "BAD_REQUEST"
  | "CONFLICT"
  | "INTERNAL_SERVER_ERROR"
  | "USER_NOT_FOUND";

export async function createAppointment(
  variables: CreateAppointmentVariables,
): Promise<
  ActionResponse<IncomingAppointment | Appointment, CreateAppointmentErrorCode>
> {
  //get the session and check if the user is authenticated

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      data: null,
      error: {
        code: "UNAUTHORIZED",
        message: "You must be logged in to create an appointment",
      },
    };
  }

  //check if the user is an admin

  if (!isAdmin(session.user)) {
    return {
      data: null,
      error: {
        code: "FORBIDDEN",
        message: "You are not authorized to create appointments",
      },
    };
  }

  //validate the values

  const parsedVariables = createAppointmentSchema
    .transform((data) => ({
      ...data,
      patientIdentificationNumber:
        data.status === "booked" ? data.patientIdentificationNumber : undefined,
      type: data.status === "booked" ? data.type : undefined,
    }))
    .safeParse(variables);

  if (!parsedVariables.success) {
    return {
      data: null,
      error: {
        code: "BAD_REQUEST",
        message: `Invalid data: ${parsedVariables.error.message}`,
      },
    };
  }

  const { start, end, status, patientIdentificationNumber, type } =
    parsedVariables.data;

  //if booked, check if the patient exists and get the patient id

  let patient: {
    id: string;
    name: string;
    email: string;
    identificationNumber: string;
  } | null = null;

  if (status === "booked" && patientIdentificationNumber) {
    const { data: patientData, error: patientDbError } = await tryCatch(
      db
        .select({
          id: user.id,
          identificationNumber: user.identificationNumber,
          name: user.name,
          email: user.email,
        })
        .from(user)
        .where(eq(user.identificationNumber, patientIdentificationNumber)),
    );

    if (patientDbError) {
      console.error(patientDbError);

      return {
        data: null,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong fetching patient data",
        },
      };
    }

    if (!patientData || patientData.length !== 1) {
      return {
        data: null,
        error: {
          code: "USER_NOT_FOUND",
          message:
            "The patient with the provided identification number was not found",
        },
      };
    }

    patient = patientData[0];
  }

  //TODO: check if patient does not have other appointments in the same time

  //check conflicts with other appointments

  const { data: dbCheckConflictsData, error: dbCheckConflictsError } =
    await tryCatch(
      db
        .select({ id: appointment.id })
        .from(appointment)
        .where(and(gte(appointment.start, start), lte(appointment.end, end))),
    );

  if (dbCheckConflictsError) {
    console.error(dbCheckConflictsError);

    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to check conflicts",
      },
    };
  }

  if (dbCheckConflictsData && dbCheckConflictsData.length > 0)
    return {
      data: null,
      error: {
        code: "CONFLICT",
        message: "The appointment conflicts with another appointment",
      },
    };

  //all good, create the appointment

  const { data: dbInsertAppointmentData, error: dbInsertAppointmentError } =
    await tryCatch(
      db
        .insert(appointment)
        .values({
          id: generateId(32),
          start,
          end,
          status,
          patientId: status === "booked" && patient ? patient.id : null,
          type: status === "booked" && patient ? type : null,
        })
        .returning(),
    );

  if (dbInsertAppointmentError) {
    console.error(dbInsertAppointmentError);

    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create appointment",
      },
    };
  }

  // Send confirmation email if appointment is booked for a patient
  if (status === "booked" && patient) {
    try {
      // Get patient language preference
      const { data: patientData, error: patientDbError } = await tryCatch(
        db
          .select({ language: user.language })
          .from(user)
          .where(eq(user.id, patient.id))
          .limit(1),
      );

      if (!patientDbError && patientData && patientData.length > 0) {
        const patientLanguage = patientData[0].language as "en" | "es";

        // Format date and time for email
        const { date: appointmentDate, time: appointmentTime } =
          formatAppointmentDateTime(start, patientLanguage);

        // Calculate duration in minutes
        const durationMinutes = Math.round(
          (end.getTime() - start.getTime()) / (1000 * 60),
        );

        // Send confirmation email
        await sendAppointmentConfirmation({
          to: patient.email,
          patientName: patient.name,
          appointmentId: dbInsertAppointmentData[0].id,
          appointmentDate,
          appointmentTime,
          appointmentType: type || "in-person",
          location: dbInsertAppointmentData[0].location || undefined,
          meetingLink: dbInsertAppointmentData[0].meetingLink || undefined,
          duration: `${durationMinutes} minutes`,
          language: patientLanguage,
          calendarAttachment: true,
          startDate: start,
          durationMinutes,
        });

        console.log(
          "Appointment confirmation email sent successfully (admin created)",
        );
      }
    } catch (emailError) {
      // Log error but don't fail the appointment creation
      console.error(
        "Failed to send appointment confirmation email:",
        emailError,
      );
    }

    return {
      data: {
        appointment: dbInsertAppointmentData[0],
        patient: {
          identificationNumber: patient.identificationNumber,
          name: patient.name,
          email: patient.email,
        },
      },
      error: null,
    };
  }

  return {
    data: dbInsertAppointmentData[0],
    error: null,
  };
}
