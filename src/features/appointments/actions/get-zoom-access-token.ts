"use server";

import { headers } from "next/headers";

import { auth } from "@/shared/lib/better-auth/server";
import type { ActionResponse } from "@/shared/types";
import { tryCatch } from "@/shared/utils/try-catch";

type ErrorCode = "UNAUTHORIZED" | "FORBIDDEN" | "INTERNAL_SERVER_ERROR";

const ZOOM_ACCOUNT_ID = process.env.ZOOM_ACCOUNT_ID;
const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID;
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;

let cachedToken: string | null = null;
let tokenExpiresAt: number | null = null;

export const getZoomAccessToken = async (): Promise<
  ActionResponse<string, ErrorCode>
> => {
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

  const now = Date.now();

  if (cachedToken && tokenExpiresAt && now < tokenExpiresAt) {
    return {
      data: cachedToken,
      error: null,
    };
  }

  const credentials = Buffer.from(
    `${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`,
  ).toString("base64");

  const { data, error } = await tryCatch(
    fetch(
      `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${ZOOM_ACCOUNT_ID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${credentials}`,
        },
      },
    ),
  );

  if (error) {
    console.error(error);

    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An error occurred while fetching the Zoom access token",
      },
    };
  }

  if (!data.ok) {
    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An error occurred while fetching the Zoom access token",
      },
    };
  }

  const { access_token, expires_in } = (await data.json()) as {
    access_token: string;
    expires_in: number;
  };

  if (!access_token || !expires_in) {
    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An error occurred while fetching the Zoom access token",
      },
    };
  }

  cachedToken = access_token;
  tokenExpiresAt = now + (expires_in - 60) * 1000; // 60s margin

  return {
    data: access_token,
    error: null,
  };
};
