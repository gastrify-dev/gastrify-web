import { z } from "zod";

export const updateAppointmentSchema = z
  .object({
    id: z.string(),
    start: z.date(),
    end: z.date(),
    status: z.enum(["available", "booked"]),
    patientIdentificationNumber: z.string().trim().optional(),
    type: z.enum(["virtual", "in-person"]).optional(),
  })
  .refine((data) => data.start < data.end, {
    message: "End date and time must be after start date and time",
    path: ["end"],
  })
  .refine(
    (data) => data.status !== "booked" || !!data.patientIdentificationNumber,
    {
      path: ["patientIdentificationNumber"],
      message: "Patient ID is required for booked appointments",
    },
  )
  .refine(
    (data) =>
      data.status !== "booked" ||
      (data.patientIdentificationNumber?.length === 10 &&
        /^\d+$/.test(data.patientIdentificationNumber)),
    {
      path: ["patientIdentificationNumber"],
      message: "Patient ID must be exactly 10 digits",
    },
  )
  .refine((data) => data.status !== "booked" || !!data.type, {
    path: ["type"],
    message: "Type is required for booked appointments",
  });
