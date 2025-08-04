import { z } from "zod";

export const createMeetingSchema = z.object({
  topic: z.string().min(1),
  startTime: z.string().min(1),
  duration: z.number().min(1),
  agenda: z.string().optional(),
});
