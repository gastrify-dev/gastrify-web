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
  const targetPatientId = isAdmin(session.user)
    ? data.patientId
    : session.user.id;

  // Check if the user is authorized to set medical information for this patient

  if (!isAdmin(session.user) && targetPatientId !== session.user.id) {
    return {
      data: null,
      error: {
        code: "FORBIDDEN",
        message:
          "You are not authorized to set medical information for this patient",
      },
    };
  }

  const basePayload = {
    ...data,
    id: generateId(32),
    patientId: targetPatientId,
  };

  const { id: _ignoreId, patientId: _ignorePid, ...updatable } = basePayload;

  const { error } = await tryCatch(
    db
      .insert(medicalInfo)
      .values(basePayload)
      .onConflictDoUpdate({
        target: medicalInfo.patientId,
        set: { ...updatable, updatedAt: new Date() },
      })
      .returning({ patientId: medicalInfo.patientId }),
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
