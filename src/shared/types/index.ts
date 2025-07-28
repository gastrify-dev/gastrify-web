import { z } from "zod";

import { twoFactorSchema } from "@/shared/schemas/two-factor";
import { authClient } from "@/shared/lib/better-auth/client";
import { user } from "@/shared/lib/drizzle/schema";

export type TwoFactorVariables = z.infer<typeof twoFactorSchema>;

export type Session = typeof authClient.$Infer.Session;
export interface AuthClientError {
  code?: string | undefined;
  message?: string | undefined;
  status: number;
  statusText: string;
}

export type ActionResponse<T, E extends string> =
  | { data: T; error: null }
  | { error: ActionError<E>; data: null };

export type ActionError<E extends string> = { code: E; message: string };

export type User = typeof user.$inferSelect;
