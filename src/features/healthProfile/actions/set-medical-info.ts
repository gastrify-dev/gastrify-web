"use server";

import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { generateId } from "better-auth";

import { db } from "@/shared/lib/drizzle/server";
import { auth } from "@/shared/lib/better-auth/server";
import { medicalInfo } from "@/shared/lib/drizzle/schema";
import { ActionResponse } from "@/shared/types";
import { tryCatch } from "@/shared/utils/try-catch";

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

  const { ...medicalInfoData } = parsedVariables.data;

  const { data: existingMedicalInfo, error: existingMedicalInfoError } =
    await tryCatch(
      db
        .select()
        .from(medicalInfo)
        .where(eq(medicalInfo.patientId, session.user.id))
        .limit(1),
    );

  if (existingMedicalInfoError) {
    console.error(existingMedicalInfoError);

    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred",
      },
    };
  }

  if (!existingMedicalInfo || existingMedicalInfo.length === 0) {
    const { error: dbInsertMedicalInfoError } = await tryCatch(
      db.insert(medicalInfo).values({
        id: generateId(32),
        patientId: session.user.id,
        ...medicalInfoData,
      }),
    );

    if (dbInsertMedicalInfoError) {
      console.error(dbInsertMedicalInfoError);
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
  }
  const { error: dbUpdatePersonalInfoError } = await tryCatch(
    db
      .update(medicalInfo)
      .set(medicalInfoData)
      .where(eq(medicalInfo.patientId, session.user.id)),
  );

  if (dbUpdatePersonalInfoError) {
    console.error(dbUpdatePersonalInfoError);

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
};
