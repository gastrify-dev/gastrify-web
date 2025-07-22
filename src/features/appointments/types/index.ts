import type { z } from "zod/v4";

import { appointment } from "@/shared/lib/drizzle/schema";

import { createAppointmentSchema } from "@/features/appointments/schemas/create-appointment";
import { bookAppointmentSchema } from "@/features/appointments/schemas/book-appointment";
import { updateAppointmentSchema } from "@/features/appointments/schemas/update-appointment";
import { cancelAppointmentSchema } from "@/features/appointments/schemas/cancel-appointment";
import { deleteAppointmentSchema } from "@/features/appointments/schemas/delete-appointment";

export type CalendarView = "month" | "week" | "day" | "agenda";

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: EventColor;
}

export type EventColor =
  | "sky"
  | "amber"
  | "violet"
  | "rose"
  | "emerald"
  | "orange";

export type Appointment = typeof appointment.$inferSelect;
export type CreateAppointmentVariables = z.infer<
  typeof createAppointmentSchema
>;
export type BookAppointmentVariables = z.infer<typeof bookAppointmentSchema>;
export type UpdateAppointmentVariables = z.infer<
  typeof updateAppointmentSchema
>;
export type CancelAppointmentVariables = z.infer<
  typeof cancelAppointmentSchema
>;
export type DeleteAppointmentVariables = z.infer<
  typeof deleteAppointmentSchema
>;

export interface IncomingAppointment {
  appointment: Appointment;
  patient: {
    name: string;
    identificationNumber: string;
    email: string;
  };
}
