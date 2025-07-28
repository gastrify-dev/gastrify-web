import { z } from "zod";

import { updateNotificationsSchema } from "@/features/settings/schemas/update-notifications";

import { updateNameSchema } from "@/features/settings/schemas/update-name";
import { updateIdentificationNumberSchema } from "@/features/settings/schemas/update-identification-number";
import { updateEmailSchema } from "@/features/settings/schemas/update-email";
import { updateLanguageSchema } from "@/features/settings/schemas/update-language";

import { updatePasswordSchema } from "@/features/settings/schemas/update-password";
import { updateTwoFactorSchema } from "@/features/settings/schemas/update-two-factor";
import { generateBackupCodesSchema } from "@/features/settings/schemas/generate-backup-codes";

export type UpdateNotificationsVariables = z.infer<
  typeof updateNotificationsSchema
>;

export type UpdateNameVariables = z.infer<typeof updateNameSchema>;
export type UpdateIdentificationNumberVariables = z.infer<
  typeof updateIdentificationNumberSchema
>;
export type UpdateEmailVariables = z.infer<typeof updateEmailSchema>;
export type UpdateLanguageVariables = z.infer<typeof updateLanguageSchema>;

export type UpdatePasswordVariables = z.infer<typeof updatePasswordSchema>;
export type UpdateTwoFactorVariables = z.infer<typeof updateTwoFactorSchema>;
export type GenerateBackupCodesVariables = z.infer<
  typeof generateBackupCodesSchema
>;
