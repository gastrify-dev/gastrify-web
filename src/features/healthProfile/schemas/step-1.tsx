import z from "zod/v4";

export const Step1Schema = z.object({
  age: z.string().trim().min(1, {
    message: "Age is required",
  }),
  maritalStatus: z.string().trim().min(1, {
    message: "Marital status is required",
  }),
  profession: z.string().trim().min(1, {
    message: "Profession is required",
  }),
  occupation: z.string().trim().min(1, {
    message: "Occupation is required",
  }),
  hasChildren: z.boolean(),
  numMale: z
    .number()
    .min(0, {
      message: "The number of male children must be equal or greater than zero",
    })
    .optional(),
  numFemale: z
    .number()
    .min(0, {
      message:
        "The number of male children female be equal or greater than zero",
    })
    .optional(),
  cSections: z.boolean(),
  abortions: z.boolean(),
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
