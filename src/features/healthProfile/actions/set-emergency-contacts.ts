"use server";

import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { generateId } from "better-auth";

import { db } from "@/shared/lib/drizzle/server";
import { auth } from "@/shared/lib/better-auth/server";
import { emergencyContacts, user } from "@/shared/lib/drizzle/schema";
import { ActionResponse } from "@/shared/types";
import { tryCatch } from "@/shared/utils/try-catch";

import { emergencyContacts as emergencyContactsSchema } from "../schemas/emergency-contacts";
import { EmergencyContactsVariables } from "@/features/healthProfile/types";
import { isAdmin } from "@/shared/utils/is-admin";

export type SetEmergencyContactsErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "BAD_REQUEST"
  | "INTERNAL_SERVER_ERROR";

export const setEmergencyContacts = async (
  variables: EmergencyContactsVariables,
): Promise<ActionResponse<null, SetEmergencyContactsErrorCode>> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      data: null,
      error: {
        code: "UNAUTHORIZED",
        message: "You must be logged in to set emergency contacts information",
      },
    };
  }

  const parsedVariables = emergencyContactsSchema.safeParse(variables);

  if (!parsedVariables.success)
    return {
      data: null,
      error: {
        code: "BAD_REQUEST",
        message: "Invalid input",
      },
    };

  const data = parsedVariables.data;

  // Check if the user is authorized to set emergency contacts for this patient

  if (data.patientId !== session.user.id && !isAdmin(session.user)) {
    return {
      data: null,
      error: {
        code: "FORBIDDEN",
        message:
          "You are not authorized to set emergency contacts for this patient",
      },
    };
  }

  // Check if the patient exists

  const { data: patientData, error: patientError } = await tryCatch(
    db.select().from(user).where(eq(user.id, data.patientId)),
  );

  if (patientError) {
    console.error(patientError);

    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch patient information",
      },
    };
  }

  if (!patientData || patientData.length === 0) {
    return {
      data: null,
      error: {
        code: "NOT_FOUND",
        message: "Patient not found",
      },
    };
  }

  data.contacts.forEach(async (contact) => {
    if (contact.id) {
      const { error } = await tryCatch(
        db
          .update(emergencyContacts)
          .set({
            ...contact,
            updatedAt: new Date(),
          })
          .where(eq(emergencyContacts.id, contact.id)),
      );

      if (error) {
        console.error(error);

        return {
          data: null,
          error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update emergency contacts information",
          },
        };
      }
    } else {
      const { error } = await tryCatch(
        db.insert(emergencyContacts).values({
          ...contact,
          id: generateId(32),
          patientId: data.patientId,
        }),
      );

      if (error) {
        console.error(error);

        return {
          data: null,
          error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to insert emergency contacts information",
          },
        };
      }
    }
  });

  return {
    data: null,
    error: null,
  };
};
