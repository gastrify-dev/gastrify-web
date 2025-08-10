"use server";

import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { generateId } from "better-auth";

import { db } from "@/shared/lib/drizzle/server";
import { auth } from "@/shared/lib/better-auth/server";
import { personalInfo, user } from "@/shared/lib/drizzle/schema";
import { ActionResponse } from "@/shared/types";
import { tryCatch } from "@/shared/utils/try-catch";

import { personalInfo as personalInfoSchema } from "@/features/healthProfile/schemas/personal-info";
import { PersonalInfoVariables } from "@/features/healthProfile/types";
import { isAdmin } from "@/shared/utils/is-admin";

export type SetPersonalInfoErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "BAD_REQUEST"
  | "INTERNAL_SERVER_ERROR";

export const setPersonalInfo = async (
  variables: PersonalInfoVariables,
): Promise<ActionResponse<null, SetPersonalInfoErrorCode>> => {
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

  const parsedVariables = personalInfoSchema.safeParse(variables);

  if (!parsedVariables.success)
    return {
      data: null,
      error: {
        code: "BAD_REQUEST",
        message: "Invalid input",
      },
    };

  const data = parsedVariables.data;

  // Check if the user is authorized to set personal information for this patient

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

  // Check if the patient exists

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

  // Check if the patient already has personal information

  const { data: existingPersonalInfo, error: existingPersonalInfoError } =
    await tryCatch(
      db
        .select()
        .from(personalInfo)
        .where(eq(personalInfo.patientId, data.patientId))
        .limit(1),
    );

  if (existingPersonalInfoError) {
    console.error(existingPersonalInfoError);

    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Error checking existing personal information",
      },
    };
  }

  // If exists, update

  if (existingPersonalInfo && existingPersonalInfo.length > 0) {
    const { error } = await tryCatch(
      db
        .update(personalInfo)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(personalInfo.patientId, data.patientId)),
    );

    if (error) {
      console.error(error);

      return {
        data: null,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update personal information",
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
    db.insert(personalInfo).values({
      ...data,
      id: generateId(32),
    }),
  );

  if (error) {
    console.error(error);

    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to insert personal information",
      },
    };
  }

  return {
    data: null,
    error: null,
  };
};
