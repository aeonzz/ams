import { z } from 'zod';
import type { InventoryItemWithRelations } from './InventoryItemSchema'
import type { ReturnableRequestWithRelations } from './ReturnableRequestSchema'
import { InventoryItemWithRelationsSchema } from './InventoryItemSchema'
import { ReturnableRequestWithRelationsSchema } from './ReturnableRequestSchema'

/////////////////////////////////////////
// RETURNABLE ITEM SCHEMA
/////////////////////////////////////////

export const ReturnableItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type ReturnableItem = z.infer<typeof ReturnableItemSchema>

/////////////////////////////////////////
// RETURNABLE ITEM RELATION SCHEMA
/////////////////////////////////////////

export type ReturnableItemRelations = {
  inventoryItems: InventoryItemWithRelations[];
  returnableRequests: ReturnableRequestWithRelations[];
};

export type ReturnableItemWithRelations = z.infer<typeof ReturnableItemSchema> & ReturnableItemRelations

export const ReturnableItemWithRelationsSchema: z.ZodType<ReturnableItemWithRelations> = ReturnableItemSchema.merge(z.object({
  inventoryItems: z.lazy(() => InventoryItemWithRelationsSchema).array(),
  returnableRequests: z.lazy(() => ReturnableRequestWithRelationsSchema).array(),
}))

export default ReturnableItemSchema;
