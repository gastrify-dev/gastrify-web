"use server";

import { headers } from "next/headers";
import { eq } from "drizzle-orm";

import { db } from "@/shared/lib/drizzle/server";
import { auth } from "@/shared/lib/better-auth/server";
import { user } from "@/shared/lib/drizzle/schema";
import { ActionResponse } from "@/shared/types";
import { tryCatch } from "@/shared/utils/try-catch";

import type { User } from "@/shared/types";
import { isAdmin } from "@/shared/utils/is-admin";

type ErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "BAD_REQUEST"
  | "INTERNAL_SERVER_ERROR";

export const getPatients = async (): Promise<
  ActionResponse<User[], ErrorCode>
> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      data: null,
      error: {
        code: "UNAUTHORIZED",
        message: "You must be logged in to get patient list",
      },
    };
  }

  if (!isAdmin(session.user)) {
    return {
      data: null,
      error: {
        code: "FORBIDDEN",
        message: "User not authorized",
      },
    };
  }

  const { data, error } = await tryCatch(
    db.select().from(user).where(eq(user.role, "user")),
  );

  if (error) {
    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      },
    };
  }

  return {
    data,
    error: null,
  };
};
