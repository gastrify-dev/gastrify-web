"use server";

import { headers } from "next/headers";
import { generateId } from "better-auth";

import { db } from "@/shared/lib/drizzle/server";
import { auth } from "@/shared/lib/better-auth/server";
import { personalInfo } from "@/shared/lib/drizzle/schema";
import { ActionResponse } from "@/shared/types";
import { tryCatch } from "@/shared/utils/try-catch";

import { personalInfo as personalInfoSchema } from "@/features/healthProfile/schemas/personal-info";
import { PersonalInfoVariables } from "@/features/healthProfile/types";
import { isAdmin } from "@/shared/utils/is-admin";
import { omitKeys } from "@/features/healthProfile/utils/omit-keys";

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
  const targetPatientId = isAdmin(session.user)
    ? data.patientId
    : session.user.id;

  if (!isAdmin(session.user) && targetPatientId !== session.user.id) {
    return {
      data: null,
      error: {
        code: "FORBIDDEN",
        message:
          "You are not authorized to set personal information for this patient",
      },
    };
  }

  const basePayload = {
    ...data,
    id: generateId(32),
    patientId: targetPatientId,
  };

  const updatable = omitKeys(basePayload, ["id", "patientId"] as const);

  const { error } = await tryCatch(
    db
      .insert(personalInfo)
      .values(basePayload)
      .onConflictDoUpdate({
        target: personalInfo.patientId,
        set: { ...updatable, updatedAt: new Date() },
      }),
  );

  if (error) {
    console.error(error);

    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Error setting medical information",
      },
    };
  }

  return { data: null, error: null };
};
