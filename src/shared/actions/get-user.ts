"use server";

import { eq, or } from "drizzle-orm";

import { db } from "@/shared/lib/drizzle/server";
import { user } from "@/shared/lib/drizzle/schema";
import { tryCatch } from "@/shared/utils/try-catch";
import type { ActionResponse, User } from "@/shared/types";
import { auth } from "../lib/better-auth/server";
import { headers } from "next/headers";

interface Props {
  id?: string;
  identificationNumber?: string;
}

type ErrorCode =
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "BAD_REQUEST"
  | "INTERNAL_SERVER_ERROR";

export const getUser = async ({
  id,
  identificationNumber,
}: Props): Promise<ActionResponse<User, ErrorCode>> => {
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

  if (!id && !identificationNumber)
    return {
      data: null,
      error: {
        code: "BAD_REQUEST",
        message: "Either id or identification number is required",
      },
    };

  const { data, error } = await tryCatch(
    db
      .select()
      .from(user)
      .where(
        or(
          eq(user.id, id ?? ""),
          eq(user.identificationNumber, identificationNumber ?? ""),
        ),
      )
      .limit(1),
  );

  if (error) {
    console.error(error);

    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong while fetching the user data 😢",
      },
    };
  }

  if (!data || data.length === 0)
    return {
      data: null,
      error: {
        code: "NOT_FOUND",
        message: "User not found",
      },
    };

  return {
    data: data[0],
    error: null,
  };
};
