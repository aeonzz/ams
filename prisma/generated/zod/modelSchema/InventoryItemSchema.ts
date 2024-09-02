import { z } from 'zod';
import type { InventorySubItemWithRelations } from './InventorySubItemSchema'
import { InventorySubItemWithRelationsSchema } from './InventorySubItemSchema'

/////////////////////////////////////////
// INVENTORY ITEM SCHEMA
/////////////////////////////////////////

export const InventoryItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  isArchived: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type InventoryItem = z.infer<typeof InventoryItemSchema>

/////////////////////////////////////////
// INVENTORY ITEM RELATION SCHEMA
/////////////////////////////////////////

export type InventoryItemRelations = {
  inventorySubItems: InventorySubItemWithRelations[];
};

export type InventoryItemWithRelations = z.infer<typeof InventoryItemSchema> & InventoryItemRelations

export const InventoryItemWithRelationsSchema: z.ZodType<InventoryItemWithRelations> = InventoryItemSchema.merge(z.object({
  inventorySubItems: z.lazy(() => InventorySubItemWithRelationsSchema).array(),
}))

export default InventoryItemSchema;
