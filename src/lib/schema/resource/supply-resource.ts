import { SupplyItemSchema } from "prisma/generated/zod";
import { z } from "zod";
import { requestSchemaBase } from "../request";

export const supplyResourceRequestSchema = z.object({
  items: z
    .array(
      z.object({
        supplyItemId: z.string().refine((val) => val !== "", {
          message: "Supply item ID is required",
        }),
        quantity: z.number().min(1, "Quantity must be at least 1"),
      })
    )
    .min(1, "At least one item is required"),
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
  purpose: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
  otherPurpose: z.string().optional(),
});

export type SupplyResourceRequestSchema = z.infer<
  typeof supplyResourceRequestSchema
>;

export const supplyResourceRequestSchemaWithPath =
  supplyResourceRequestSchema.extend({
    path: z.string(),
  });

export const extendedSupplyResourceRequestSchema = requestSchemaBase.merge(
  supplyResourceRequestSchemaWithPath
);

export type ExtendedSupplyResourceRequestSchema = z.infer<
  typeof extendedSupplyResourceRequestSchema
>;

export const supplyResourceRequestSchemaServer = z.object({
  items: z.array(
    z.object({
      supplyItemId: z.string().refine((val) => val !== ""),
      quantity: z.number(),
    })
  ),
  dateAndTimeNeeded: z.date(),
  purpose: z.array(z.string()),
  otherPurpose: z.string().optional(),
});

export type SupplyResourceRequestSchemaServer = z.infer<
  typeof supplyResourceRequestSchemaServer
>;

export const supplyResourceRequestSchemaServerWithPath =
  supplyResourceRequestSchemaServer.extend({
    path: z.string(),
  });

export const extendedSupplyResourceRequestSchemaServer =
  requestSchemaBase.merge(supplyResourceRequestSchemaServerWithPath);

export type ExtendedSupplyResourceRequestSchemaServer = z.infer<
  typeof extendedSupplyResourceRequestSchema
>;
