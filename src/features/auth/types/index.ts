import { z } from "zod/v4";

import { credentialsSchema } from "@/features/auth/schemas/credentials";
import { forgotPasswordSchema } from "@/features/auth/schemas/forgot-password";
import { magicLinkSchema } from "@/features/auth/schemas/magic-link";
import { recoverySchema } from "@/features/auth/schemas/recovery";
import { resetPasswordSchema } from "@/features/auth/schemas/reset-password";
import { signUpSchema } from "@/features/auth/schemas/sign-up";

export type CredentialsVariables = z.infer<typeof credentialsSchema>;
export type ForgotPasswordVariables = z.infer<typeof forgotPasswordSchema>;
export type MagicLinkVariables = z.infer<typeof magicLinkSchema>;
export type RecoveryVariables = z.infer<typeof recoverySchema>;
export type ResetPasswordVariables = z.infer<typeof resetPasswordSchema>;
export type SignUpVariables = z.infer<typeof signUpSchema>;
