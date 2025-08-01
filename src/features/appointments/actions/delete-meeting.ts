"use server";

import { headers } from "next/headers";

import { auth } from "@/shared/lib/better-auth/server";
import type { ActionResponse } from "@/shared/types";
import { tryCatch } from "@/shared/utils/try-catch";

import { getZoomAccessToken } from "@/features/appointments/actions/get-zoom-access-token";
import { deleteMeetingSchema } from "@/features/appointments/schemas/delete-meeting";
import type { DeleteMeetingVariables } from "@/features/appointments/types";

type ErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "INTERNAL_SERVER_ERROR"
  | "BAD_REQUEST";

export const deleteMeeting = async (
  variables: DeleteMeetingVariables,
): Promise<ActionResponse<null, ErrorCode>> => {
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

  const parsedVariables = deleteMeetingSchema.safeParse(variables);

  if (!parsedVariables.success) {
    return {
      data: null,
      error: {
        code: "BAD_REQUEST",
        message: "Invalid variables",
      },
    };
  }

  const { meetingId } = parsedVariables.data;

  const { data: accessToken, error: accessTokenError } =
    await getZoomAccessToken();

  if (accessTokenError) {
    return {
      data: null,
      error: accessTokenError,
    };
  }

  const { data, error } = await tryCatch(
    fetch(`https://api.zoom.us/v2/meetings/${meetingId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  );

  if (error) {
    console.error(error);

    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An error occurred while deleting the meeting",
      },
    };
  }

  if (!data.ok) {
    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An error occurred while deleting the meeting",
      },
    };
  }

  return {
    data: null,
    error: null,
  };
};
