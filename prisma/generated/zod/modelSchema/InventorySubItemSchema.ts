import { z } from 'zod';
import { ItemStatusSchema } from '../inputTypeSchemas/ItemStatusSchema'
import type { InventoryItemWithRelations } from './InventoryItemSchema'
import { InventoryItemWithRelationsSchema } from './InventoryItemSchema'

/////////////////////////////////////////
// INVENTORY SUB ITEM SCHEMA
/////////////////////////////////////////

export const InventorySubItemSchema = z.object({
  status: ItemStatusSchema,
  id: z.string(),
  inventoryId: z.string(),
  isArchived: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type InventorySubItem = z.infer<typeof InventorySubItemSchema>

/////////////////////////////////////////
// INVENTORY SUB ITEM RELATION SCHEMA
/////////////////////////////////////////

export type InventorySubItemRelations = {
  inventory: InventoryItemWithRelations;
};

export type InventorySubItemWithRelations = z.infer<typeof InventorySubItemSchema> & InventorySubItemRelations

export const InventorySubItemWithRelationsSchema: z.ZodType<InventorySubItemWithRelations> = InventorySubItemSchema.merge(z.object({
  inventory: z.lazy(() => InventoryItemWithRelationsSchema),
}))

export default InventorySubItemSchema;
