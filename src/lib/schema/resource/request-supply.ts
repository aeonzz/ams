import { z } from "zod";

export const createSupplyRequestItemSchema = z.object({
  quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
});

export type createSupplyRequestItemSchema = z.infer<
  typeof createSupplyRequestItemSchema
>;

export const updateSupplyRequestItemSchema =
  createSupplyRequestItemSchema.partial();

export const extendedUpdateSupplyRequestItemSchema =
  updateSupplyRequestItemSchema.extend({
    id: z.string(),
    path: z.string(),
  });

export type ExtendedUpdateSupplyRequestItemSchema = z.infer<
  typeof extendedUpdateSupplyRequestItemSchema
>;

export const deleteSupplyRequestItemSchema = z.object({
  id: z.string(),
  path: z.string(),
});
