import { z } from "zod";
import { ReturnableItemSchema } from "prisma/generated/zod";
import { requestSchemaBase } from "../request";

export const returnableResourceRequestSchemaBase = z.object({
  itemId: z.string({
    required_error: "Name is required",
  }),
  dateAndTimeNeeded: z
    .date({
      required_error: "Date needed is required",
    })
    .min(new Date(), {
      message: "Date needed must be in the future",
    })
    .refine((date) => date.getHours() !== 0 || date.getMinutes() !== 0, {
      message: "Time cannot be exactly midnight (00:00)",
    }),
  returnDateAndTime: z
    .date({
      required_error: "Return date is required",
    })
    .min(new Date(), {
      message: "Return date must be in the future",
    })
    .refine((date) => date.getHours() !== 0 || date.getMinutes() !== 0, {
      message: "Time cannot be exactly midnight (00:00)",
    }),
  purpose: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
  otherPurpose: z.string().optional(),
});

export const returnableResourceRequestSchema =
  returnableResourceRequestSchemaBase.refine(
    (data) => data.dateAndTimeNeeded <= data.returnDateAndTime,
    {
      message:
        "Date and time needed must not be later than the return date and time",
      path: ["dateAndTimeNeeded"],
    }
  );

export type ReturnableResourceRequestSchema = z.infer<
  typeof returnableResourceRequestSchema
>;

export const returnableResourceRequestSchemaWithPath =
  returnableResourceRequestSchemaBase.extend({
    path: z.string(),
  });

export const extendedReturnableResourceRequestSchema = requestSchemaBase.merge(
  returnableResourceRequestSchemaWithPath
);

export type ExtendedReturnableResourceRequestSchema = z.infer<
  typeof extendedReturnableResourceRequestSchema
>;
