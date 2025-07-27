import { z } from "zod/v4";

export const personalInfo = z
  .object({
    age: z.number(),
    // .coerce
    // .number<number>()
    // .positive()
    // .min(1, { error: "Age is required" }),
    maritalStatus: z.string({
      error: "Marital Status is required",
    }),
    profession: z.string().trim().min(1, {
      message: "Profession is required",
    }),
    occupation: z.string().trim().min(1, {
      message: "Occupation is required",
    }),
    hasChildren: z.boolean(),
    numMale: z.number(),
    numFemale: z.number(),
    cSections: z.boolean(),
    abortions: z.boolean(),
    placeOfResidence: z.string().trim().min(1, {
      message: "Place of residence is required",
    }),
    city: z.string().trim().min(1, {
      message: "City is required",
    }),
    homePhoneNumber: z
      .string()
      .trim()
      .length(9, {
        error: "Home phone number must be 9 characters long",
      })
      .regex(/^02\d{7}$|^03\d{7}$|^04\d{7}$|^05\d{7}$|^06\d{7}$|^07\d{7}$/, {
        error:
          "Home phone number must have the correct fixed line number format",
      }),
    celularPhoneNumber: z
      .string()
      .trim()
      .length(10, {
        error: "Celular phone number must be 10 characters long",
      })
      .regex(/^\d{10}$/, {
        error: "Celular phone number must contain only numbers",
      }),
    workPhoneNumber: z
      .string()
      .trim()
      .regex(
        /(^02\d{7}$|^03\d{7}$|^04\d{7}$|^05\d{7}$|^06\d{7}$|^07\d{7}$)|(^\d{10}$)|(^$)/,
        {
          error: "Work phone number must be a fixed line or celular number",
        },
      )
      .optional(),
  })
  .refine(
    (data) => (data.hasChildren ? data.numFemale + data.numMale > 0 : true),
    {
      error: "You must specify the number of kids",
      path: ["numMale"],
    },
  );
