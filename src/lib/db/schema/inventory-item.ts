import { z } from "zod";

export const createInventoryItemSchema = z.object({
  returnableItemId: z
    .string()
    .min(1, "returnableItemId is required"),
});

export type CreateInventoryItemSchema = z.infer<typeof createInventoryItemSchema>