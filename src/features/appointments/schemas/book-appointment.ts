import { z } from "zod";

export const bookAppointmentSchema = z.object({
  appointmentId: z.string(),
  patientId: z.string(),
  appointmentType: z.enum(["in-person", "virtual"]),
});
