import { z } from "zod";
import { ReturnableItemSchema } from "prisma/generated/zod";
import { requestSchemaBase } from "../request";

export const returnableResourceRequestSchema = z.object({
  items: z
    .array(ReturnableItemSchema)
    .min(1, "At least one item must be selected"),
  itemDates: z.record(z.string(), z.date().nullable()),
  quantity: z.number().int().positive().min(1, {
    message: "Quantity must be at least 1",
  }),
  dateNeeded: z
    .date({
      required_error: "Date needed is required",
    })
    .min(new Date(), {
      message: "Date needed must be in the future",
    }),
  returnDate: z
    .date({
      required_error: "Date needed is required",
    })
    .min(new Date(), {
      message: "Date needed must be in the future",
    }),
  purpose: z.string().optional(),
});

export type ReturnableResourceRequestSchema = z.infer<
  typeof returnableResourceRequestSchema
>;

export const returnableResourceRequestSchemaWithPath =
  returnableResourceRequestSchema.extend({
    path: z.string(),
  });

export const extendedReturnableResourceRequestSchema = requestSchemaBase.merge(
  returnableResourceRequestSchemaWithPath
);

export type ExtendedReturnableResourceRequestSchema = z.infer<
  typeof extendedReturnableResourceRequestSchema
>;
