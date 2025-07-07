import { z } from "zod/v4";

export const bookAppointmentSchema = z.object({
  appointmentId: z.string(),
  patientId: z.string(),
  appointmentType: z.enum(["in-person", "virtual"]),
});
