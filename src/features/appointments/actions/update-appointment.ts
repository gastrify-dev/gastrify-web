"use server";

import { headers } from "next/headers";
import { and, eq, gte, lte, ne } from "drizzle-orm";

import { auth } from "@/shared/lib/better-auth/server";
import { db } from "@/shared/lib/drizzle/server";
import { appointment, user } from "@/shared/lib/drizzle/schema";
import type { ActionResponse } from "@/shared/types";
import { isAdmin } from "@/shared/utils/is-admin";
import { tryCatch } from "@/shared/utils/try-catch";

import type {
  Appointment,
  IncomingAppointment,
  UpdateAppointmentVariables,
} from "@/features/appointments/types";
import { updateAppointmentSchema } from "@/features/appointments/schemas/update-appointment";

export type UpdateAppointmentErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "BAD_REQUEST"
  | "CONFLICT"
  | "INTERNAL_SERVER_ERROR"
  | "USER_NOT_FOUND"
  | "APPOINTMENT_NOT_FOUND";

export async function updateAppointment(
  variables: UpdateAppointmentVariables,
): Promise<
  ActionResponse<IncomingAppointment | Appointment, UpdateAppointmentErrorCode>
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
        message: "You must be logged in to update an appointment",
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

  const parsedVariables = updateAppointmentSchema
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

  const { id, start, end, status, patientIdentificationNumber, type } =
    parsedVariables.data;

  //check if the appointment exists

  const { data: existingAppointment, error: existingAppointmentDbError } =
    await tryCatch(db.select().from(appointment).where(eq(appointment.id, id)));

  if (existingAppointmentDbError) {
    console.error(existingAppointmentDbError);

    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to check if appointment exists",
      },
    };
  }

  if (!existingAppointment || existingAppointment.length === 0) {
    return {
      data: null,
      error: {
        code: "APPOINTMENT_NOT_FOUND",
        message: "Appointment not found",
      },
    };
  }

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
        .where(
          and(
            gte(appointment.start, start),
            lte(appointment.end, end),
            ne(appointment.id, id),
          ),
        ),
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

  //all good, update the appointment

  const { data: dbUpdateAppointmentData, error: dbUpdateAppointmentError } =
    await tryCatch(
      db
        .update(appointment)
        .set({
          start,
          end,
          status,
          patientId: status === "booked" && patient ? patient.id : null,
          type: status === "booked" && patient ? type : null,
        })
        .where(eq(appointment.id, id))
        .returning(),
    );

  if (dbUpdateAppointmentError) {
    console.error(dbUpdateAppointmentError);

    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update appointment",
      },
    };
  }

  if (status === "booked" && patient) {
    return {
      data: {
        appointment: dbUpdateAppointmentData[0],
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
    data: dbUpdateAppointmentData[0],
    error: null,
  };
}
