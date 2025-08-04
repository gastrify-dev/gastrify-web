import { headers } from "next/headers";
import { eq } from "drizzle-orm";

import { ActionResponse } from "@/shared/types";
import { auth } from "../lib/better-auth/server";
import { db } from "../lib/drizzle/server";

import {
  personalInfo,
  medicalInfo,
  emergencyContacts,
} from "../lib/drizzle/schema";

interface Props {
  id: string;
}

type ErrorCode =
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "BAD_REQUEST"
  | "INTERNAL_SERVER_ERROR";

export const isProfileCompleted = async ({
  id,
}: Props): Promise<ActionResponse<boolean, ErrorCode>> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      data: null,
      error: {
        code: "UNAUTHORIZED",
        message: "You must be logged in to access this resource",
      },
    };
  }

  try {
    const [personal, medical, contacts] = await Promise.all([
      db
        .select({ id: personalInfo.id })
        .from(personalInfo)
        .where(eq(personalInfo.patientId, id))
        .limit(1),

      db
        .select({ id: medicalInfo.id })
        .from(medicalInfo)
        .where(eq(medicalInfo.patientId, id))
        .limit(1),

      db
        .select({ id: emergencyContacts.id })
        .from(emergencyContacts)
        .where(eq(emergencyContacts.patientId, id))
        .limit(1),
    ]);

    return {
      data: personal.length > 0 && medical.length > 0 && contacts.length > 0,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      },
    };
  }
};
