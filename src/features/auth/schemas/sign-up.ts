import { z } from "zod/v4";

export const signUpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, {
      message: "Name must be at least 2 characters long",
    })
    .max(50, {
      message: "Name must be at most 50 characters long",
    }),
  identificationNumber: z
    .string()
    .trim()
    .length(10, {
      message: "Identification number must be 10 characters long",
    })
    .regex(/^[0-9]+$/, {
      message: "Identification number must contain only numbers",
    }),
  email: z.email({
    message: "Email must be a valid email address",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .max(50, {
      message: "Password must be at most 50 characters long",
    })
    .regex(/[0-9]/, {
      message: "Password must contain at least one number",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[^\w\s]/, {
      message: "Password must contain at least one special character",
    }),
});
