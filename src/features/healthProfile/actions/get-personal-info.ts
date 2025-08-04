"use server";

import { headers } from "next/headers";
import { eq } from "drizzle-orm";

import { db } from "@/shared/lib/drizzle/server";
import { auth } from "@/shared/lib/better-auth/server";
import { personalInfo } from "@/shared/lib/drizzle/schema";
import { ActionResponse } from "@/shared/types";
import { tryCatch } from "@/shared/utils/try-catch";

import type { PersonalInfoVariables } from "../types";
import { isAdmin } from "@/shared/utils/is-admin";

export type GetPersonalInfoErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "BAD_REQUEST"
  | "INTERNAL_SERVER_ERROR";

export const getPersonalInfo = async (
  patientId: string,
): Promise<ActionResponse<PersonalInfoVariables, GetPersonalInfoErrorCode>> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      data: null,
      error: {
        code: "UNAUTHORIZED",
        message: "You must be logged in to get personal information",
      },
    };
  }

  if (patientId !== session.user.id && !isAdmin(session.user))
    return {
      data: null,
      error: {
        code: "FORBIDDEN",
        message: "User not authorized",
      },
    };

  const { data, error } = await tryCatch(
    db
      .select()
      .from(personalInfo)
      .where(eq(personalInfo.patientId, patientId))
      .limit(1),
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

  if (data.length === 0) {
    return {
      data: null,
      error: { code: "NOT_FOUND", message: "Personal information not found" },
    };
  }

  return {
    data: data[0],
    error: null,
  };
};
