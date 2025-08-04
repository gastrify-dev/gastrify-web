import { z } from "zod";

export const deleteMeetingSchema = z.object({
  meetingId: z.string().min(1),
});
