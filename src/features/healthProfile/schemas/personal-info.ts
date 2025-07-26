import { z } from "zod/v4";

export const personalInfo = z
  .object({
    age: z.coerce
      .number<number>()
      .positive()
      .min(1, { error: "Age is required" }),
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
    numMale: z.string().trim().optional(),
    numFemale: z.string().trim().optional(),
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
  .check((ctx) => {
    if (ctx.value.hasChildren) {
      const male = parseInt(ctx.value.numMale ?? "0", 10);
      const female = parseInt(ctx.value.numFemale ?? "0", 10);
      const total = (isNaN(male) ? 0 : male) + (isNaN(female) ? 0 : female);
      console.log(total);
      if (total <= 0) {
        ctx.issues.push({
          code: "custom",
          message: "You must specify the number of kids",
          input: ctx.value,
          path: ["numMale"],
        });
      }
    }
  });
