import { z } from "zod/v4";

export const cancelAppointmentSchema = z.object({
  appointmentId: z.string().min(1, {
    message: "Appointment ID is required",
  }),
});
