import { ReturnableItemStatusSchema } from "prisma/generated/zod";
import { z } from "zod";

export const createInventorytSchemaServer = z.object({
  returnableItemId: z.string(),
});

export const createInventorytSchemaWithPath =
  createInventorytSchemaServer.extend({
    path: z.string(),
  });

export type CreateInventorytSchemaWithPath = z.infer<
  typeof createInventorytSchemaWithPath
>;

export const updateInventoryItemSchemaServer = z.object({
  status: ReturnableItemStatusSchema.optional(),
});

export const extendedUpdateInventoryItemServerSchema =
  updateInventoryItemSchemaServer.extend({
    path: z.string(),
    id: z.string().optional(),
  });

export type ExtendedUpdateInventoryItemServerSchema = z.infer<
  typeof extendedUpdateInventoryItemServerSchema
>;
