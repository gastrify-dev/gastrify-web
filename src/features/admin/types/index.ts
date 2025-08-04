import { z } from "zod";

import type { User } from "@/shared/types";

import { banUserSchema } from "@/features/admin/schemas/ban-user";
import { unbanUserSchema } from "@/features/admin/schemas/unban-user";
import { deleteUserSchema } from "@/features/admin/schemas/delete-user";
import { updateUserSchema } from "@/features/admin/schemas/update-user";

export type UpdateUserVariables = z.infer<typeof updateUserSchema>;
export type BanUserVariables = z.infer<typeof banUserSchema>;
export type UnbanUserVariables = z.infer<typeof unbanUserSchema>;
export type DeleteUserVariables = z.infer<typeof deleteUserSchema>;

export type ListUsers = {
  users: User[];
  total: number;
  limit: number | undefined;
  offset: number | undefined;
};
