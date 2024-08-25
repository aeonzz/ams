import { RequestStatusTypeSchema } from "prisma/generated/zod";
import { z } from "zod";

export const ReservedDateTimeSchema = z.object({
  venueName: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  request: z.object({
    status: RequestStatusTypeSchema,
    title: z.string(),
    department: z.string(),
  }),
});

export type ReservedDatesAndTimes = z.infer<typeof ReservedDateTimeSchema>;
