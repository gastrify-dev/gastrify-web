import { z } from "zod/v4";

export const personalInfo = z.object({
  age: z
    // .string()
    // .refine((val) => {
    //   try {
    //     const parsed = Number.parseInt(val);
    //     return parsed;
    //   } catch (error) {
    //     return false;
    //   }
    // }, {error: 'Age must be number'})
    // .pipe(z.transform((val) => Number.parseInt(val))),
    .number(),
  maritalStatus: z.string({
    error: "Marital Status is required",
  }),
  profession: z.string().trim().min(1, {
    message: "Profession is required",
  }),
  occupation: z.string().trim().min(1, {
    message: "Occupation is required",
  }),
  hasChildren: z.enum(["yes", "no"], {
    error: "Has Children is required",
  }),
  numMale: z.string().trim().optional(),
  numFemale: z.string().trim().optional(),
  cSections: z.enum(["yes", "no"]),
  abortions: z.enum(["yes", "no"]),
  placeOfResidence: z.string().trim().min(1, {
    message: "Place of residence is required",
  }),
  city: z.string().trim().min(1, {
    message: "City is required",
  }),
  homePhoneNumber: z.string().trim().min(1, {
    message: "Home phone number is required",
  }),
  celularPhoneNumber: z.string().trim().min(1, {
    message: "Celular phone number is required",
  }),
  workPhoneNumber: z.string().trim().min(1, {
    message: "Work phone number is required",
  }),
});
