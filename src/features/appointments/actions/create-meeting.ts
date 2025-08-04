"use server";

import { headers } from "next/headers";

import { auth } from "@/shared/lib/better-auth/server";
import type { ActionResponse } from "@/shared/types";
import { tryCatch } from "@/shared/utils/try-catch";

import { getZoomAccessToken } from "@/features/appointments/actions/get-zoom-access-token";
import { createMeetingSchema } from "@/features/appointments/schemas/create-meeting";
import type { CreateMeetingVariables } from "@/features/appointments/types";

type ErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "INTERNAL_SERVER_ERROR"
  | "BAD_REQUEST";

export const createMeeting = async (
  variables: CreateMeetingVariables,
): Promise<ActionResponse<string, ErrorCode>> => {
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

  const parsedVariables = createMeetingSchema.safeParse(variables);

  if (!parsedVariables.success) {
    return {
      data: null,
      error: {
        code: "BAD_REQUEST",
        message: "Invalid variables",
      },
    };
  }

  const { topic, startTime, duration, agenda } = parsedVariables.data;

  const { data: accessToken, error: accessTokenError } =
    await getZoomAccessToken();

  if (accessTokenError) {
    return {
      data: null,
      error: accessTokenError,
    };
  }

  const { data: createMeetingResponse, error: createMeetingError } =
    await tryCatch(
      fetch(`https://api.zoom.us/v2/users/me/meetings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          type: 2, // scheduled
          start_time: startTime,
          duration,
          agenda,
          timezone: "America/Guayaquil",
          settings: {
            join_before_host: true,
            waiting_room: false,
          },
        }),
      }),
    );

  if (createMeetingError) {
    console.error(createMeetingError);

    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An error occurred while creating the meeting link",
      },
    };
  }

  if (!createMeetingResponse.ok) {
    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An error occurred while creating the meeting link",
      },
    };
  }

  const { join_url } = (await createMeetingResponse.json()) as {
    join_url: string;
  };

  if (!join_url) {
    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An error occurred while creating the meeting link",
      },
    };
  }

  return {
    data: join_url,
    error: null,
  };
};
