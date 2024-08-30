import { RequestStatusTypeSchema } from "prisma/generated/zod";
import { z } from "zod";

export const reservedDateTimeSchema = z.object({
  venueName: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  request: z.object({
    status: RequestStatusTypeSchema,
    title: z.string(),
    department: z.string(),
  }),
});

export type ReservedDatesAndTimes = z.infer<typeof reservedDateTimeSchema>;

export const reservedTransportDateAndTime = z.object({
  dateAndTimeNeeded: z.date(),
  request: z.object({
    status: RequestStatusTypeSchema,
    title: z.string(),
    department: z.string(),
  }),
});

export type ReservedTransportDateAndTime = z.infer<
  typeof reservedTransportDateAndTime
>;

export const reservedReturnableItemDateAndTime = z.object({
  dateAndTimeNeeded: z.date(),
  returnDateAndTime: z.date(),
  request: z.object({
    status: RequestStatusTypeSchema,
    title: z.string(),
    department: z.string(),
  }),
  item: z.object({
    name: z.string(),
  }),
});

export type ReservedReturnableItemDateAndTime = z.infer<
  typeof reservedReturnableItemDateAndTime
>;
