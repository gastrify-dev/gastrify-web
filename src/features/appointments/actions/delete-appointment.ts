"use server";

import { headers } from "next/headers";
import { eq } from "drizzle-orm";

import { auth } from "@/shared/lib/better-auth/server";
import { db } from "@/shared/lib/drizzle/server";
import { appointment } from "@/shared/lib/drizzle/schema";
import type { ActionResponse } from "@/shared/types";
import { isAdmin } from "@/shared/utils/is-admin";
import { tryCatch } from "@/shared/utils/try-catch";

import { deleteAppointmentSchema } from "@/features/appointments/schemas/delete-appointment";
import type { DeleteAppointmentVariables } from "@/features/appointments/types";

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
    db.delete(appointment).where(eq(appointment.id, appointmentId)),
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

  if (data && data.rowCount === 0) {
    return {
      data: null,
      error: {
        code: "NOT_FOUND",
        message: "Appointment not found",
      },
    };
  }

  return {
    data: {
      id: appointmentId,
    },
    error: null,
  };
}
