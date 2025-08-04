import { z } from "zod/v4";

export const personalInfo = z
  .object({
    age: z.number("Age is required").refine((data) => Number(data)),
    maritalStatus: z.enum(
      ["single", "married", "divorced", "widowed", "separated"],
      {
        error: "Marital status is required",
      },
    ),
    profession: z.string().trim().min(1, {
      message: "Profession is required",
    }),
    occupation: z.string().trim().min(1, {
      message: "Occupation is required",
    }),
    hasChildren: z.boolean(),
    numMale: z.number("Number of male children is required"),
    numFemale: z.number("Number of female children is required"),
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
      .regex(/(^\d+$)|(^$)/, {
        error: "Home phone number must contain only numbers",
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
      .regex(/(^\d+$)|(^$)/, {
        error: "Work phone number must contain only numbers",
      }),
  })
  .refine(
    (data) => (data.hasChildren ? data.numFemale + data.numMale > 0 : true),
    {
      error: "You must specify the number of kids",
      path: ["numMale"],
    },
  );
