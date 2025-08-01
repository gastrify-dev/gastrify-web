"use server";

import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { generateId } from "better-auth";

import { db } from "@/shared/lib/drizzle/server";
import { auth } from "@/shared/lib/better-auth/server";
import { personalInfo } from "@/shared/lib/drizzle/schema";
import { ActionResponse } from "@/shared/types";
import { tryCatch } from "@/shared/utils/try-catch";

import { personalInfo as personalInfoSchema } from "@/features/healthProfile/schemas/personal-info";
import { PersonalInfoVariables } from "../types";

export type SetPersonalInfoErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "BAD_REQUEST"
  | "INTERNAL_SERVER_ERROR";

export const setPersonalInfo = async (
  variables: PersonalInfoVariables,
): Promise<ActionResponse<null, SetPersonalInfoErrorCode>> => {
  //check if user is authenticated

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

  //parse values

  const parsedVariables = personalInfoSchema.safeParse(variables);

  if (!parsedVariables.success) {
    return {
      data: null,
      error: {
        code: "BAD_REQUEST",
        message: "Invalid input",
      },
    };
  }

  const { ...personalInfoData } = parsedVariables.data;

  //check if user alredy has a form

  const { data: existingPersonalInfo, error: existingPersonalInfoError } =
    await tryCatch(
      db
        .select()
        .from(personalInfo)
        .where(eq(personalInfo.patientId, session.user.id))
        .limit(1),
    );

  if (existingPersonalInfoError) {
    console.error(existingPersonalInfoError);

    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred",
      },
    };
  }

  // if it does not exists create it

  if (!existingPersonalInfo || existingPersonalInfo.length === 0) {
    const { error: debInsertPersonalInfoError } = await tryCatch(
      db.insert(personalInfo).values({
        id: generateId(32),
        patientId: session.user.id,
        ...personalInfoData,
      }),
    );

    if (debInsertPersonalInfoError) {
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
  }

  // if it exists update it

  const { error: dbUpdatePersonalInfoError } = await tryCatch(
    db
      .update(personalInfo)
      .set(personalInfoData)
      .where(eq(personalInfo.patientId, session.user.id)),
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
