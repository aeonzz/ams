import { z } from 'zod';
import { ReturnableItemStatusSchema } from '../inputTypeSchemas/ReturnableItemStatusSchema'
import type { ReturnableItemWithRelations } from './ReturnableItemSchema'
import { ReturnableItemWithRelationsSchema } from './ReturnableItemSchema'

/////////////////////////////////////////
// INVENTORY ITEM SCHEMA
/////////////////////////////////////////

export const InventoryItemSchema = z.object({
  status: ReturnableItemStatusSchema,
  id: z.string(),
  returnableItemId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type InventoryItem = z.infer<typeof InventoryItemSchema>

/////////////////////////////////////////
// INVENTORY ITEM RELATION SCHEMA
/////////////////////////////////////////

export type InventoryItemRelations = {
  returnableItem: ReturnableItemWithRelations;
};

export type InventoryItemWithRelations = z.infer<typeof InventoryItemSchema> & InventoryItemRelations

export const InventoryItemWithRelationsSchema: z.ZodType<InventoryItemWithRelations> = InventoryItemSchema.merge(z.object({
  returnableItem: z.lazy(() => ReturnableItemWithRelationsSchema),
}))

export default InventoryItemSchema;
