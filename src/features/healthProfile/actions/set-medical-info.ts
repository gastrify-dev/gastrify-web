"use server";

import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { generateId } from "better-auth";

import { db } from "@/shared/lib/drizzle/server";
import { auth } from "@/shared/lib/better-auth/server";
import { medicalInfo, user } from "@/shared/lib/drizzle/schema";
import { ActionResponse } from "@/shared/types";
import { tryCatch } from "@/shared/utils/try-catch";
import { isAdmin } from "@/shared/utils/is-admin";

import { medicalInfo as medicalInfoSchema } from "@/features/healthProfile/schemas/medical-info";
import { MedicalInfoVariables } from "@/features/healthProfile/types";

export type SetMedicalInfoErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "BAD_REQUEST"
  | "INTERNAL_SERVER_ERROR";

export const setMedicalInfo = async (
  variables: MedicalInfoVariables,
): Promise<ActionResponse<null, SetMedicalInfoErrorCode>> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      data: null,
      error: {
        code: "UNAUTHORIZED",
        message: "You must be logged in to set personal information",
      },
    };
  }

  const parsedVariables = medicalInfoSchema.safeParse(variables);

  if (!parsedVariables.success)
    return {
      data: null,
      error: {
        code: "BAD_REQUEST",
        message: "Invalid input",
      },
    };

  const data = parsedVariables.data;

  // Check if the user is authorized to set medical information for this patient

  if (data.patientId !== session.user.id && !isAdmin(session.user)) {
    return {
      data: null,
      error: {
        code: "FORBIDDEN",
        message:
          "You are not authorized to set personal information for this patient",
      },
    };
  }

  // Check if patient exists

  const { data: patientData, error: patientError } = await tryCatch(
    db.select().from(user).where(eq(user.id, data.patientId)).limit(1),
  );

  if (patientError) {
    console.error(patientError);

    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Error checking patient existence",
      },
    };
  }

  if (patientData.length === 0) {
    return {
      data: null,
      error: {
        code: "NOT_FOUND",
        message: "Patient not found",
      },
    };
  }

  // Check if the patient already has medical information

  const { data: existingMedicalInfo, error: existingError } = await tryCatch(
    db
      .select()
      .from(medicalInfo)
      .where(eq(medicalInfo.patientId, data.patientId)),
  );

  if (existingError) {
    console.error(existingError);

    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Error checking existing personal information",
      },
    };
  }

  // If exists, update

  if (existingMedicalInfo && existingMedicalInfo.length > 0) {
    const { error } = await tryCatch(
      db
        .update(medicalInfo)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(medicalInfo.patientId, data.patientId)),
    );

    if (error) {
      console.error(error);

      return {
        data: null,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Error updating medical information",
        },
      };
    }

    return {
      data: null,
      error: null,
    };
  }

  // If not exists, insert

  const { error } = await tryCatch(
    db.insert(medicalInfo).values({
      ...data,
      id: generateId(),
    }),
  );

  if (error) {
    console.error(error);

    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to insert medical information",
      },
    };
  }

  return {
    data: null,
    error: null,
  };
};
