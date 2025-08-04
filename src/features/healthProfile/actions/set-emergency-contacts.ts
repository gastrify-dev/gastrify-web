"use server";

import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { generateId } from "better-auth";

import { db } from "@/shared/lib/drizzle/server";
import { auth } from "@/shared/lib/better-auth/server";
import { emergencyContacts } from "@/shared/lib/drizzle/schema";
import { ActionResponse } from "@/shared/types";
import { tryCatch } from "@/shared/utils/try-catch";

import { emergencyContacts as emergencyContactsSchema } from "../schemas/emergency-contacts";
import { EmergencyContactsVariables } from "@/features/healthProfile/types";

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

  const { ...emergencyContactsData } = parsedVariables.data;

  emergencyContactsData.contacts.forEach(async (contact) => {
    if (contact.id) {
      const { error } = await tryCatch(
        db
          .update(emergencyContacts)
          .set(contact)
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
      const { id, ...contactWithoutId } = contact;

      const { error } = await tryCatch(
        db.insert(emergencyContacts).values({
          id: generateId(32),
          patientId: session.user.id,
          ...contactWithoutId,
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
