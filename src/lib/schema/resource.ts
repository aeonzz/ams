import { ResourceItemSchema } from "prisma/generated/zod";
import { z } from "zod";
import { requestSchemaBase } from "./request";

export const resourceRequestSchema = z.object({
  resourceItems: z.array(ResourceItemSchema).min(1, {
    message: "At least one resource item is required",
  }),
  quantity: z.number().int().positive().min(1, {
    message: "Quantity must be at least 1",
  }),
  dateNeeded: z
    .date({
      required_error: "Start time is required",
    })
    .min(new Date(), {
      message: "Date needed must be in the future",
    }),
  returnDate: z.coerce
    .date()
    .optional()
    .nullable()
    .refine((date) => !date || date > new Date(), {
      message: "Return date must be in the future",
    }),
  purpose: z.string().optional(),
});

export type ResourceRequestSchema = z.infer<typeof resourceRequestSchema>;

export const resourceRequestSchemaWithPath = resourceRequestSchema.extend({
  path: z.string(),
});

export const extendedResourceRequestSchema = requestSchemaBase.merge(
  resourceRequestSchemaWithPath
);

export type ExtendedResourceRequestSchema = z.infer<
  typeof extendedResourceRequestSchema
>;
