import { z } from "zod";

export const cancelAppointmentSchema = z.object({
  appointmentId: z.string().min(1, {
    message: "Appointment ID is required",
  }),
});
