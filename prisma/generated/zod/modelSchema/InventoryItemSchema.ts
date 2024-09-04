import { z } from 'zod';
import type { InventorySubItemWithRelations } from './InventorySubItemSchema'
import type { DepartmentWithRelations } from './DepartmentSchema'
import { InventorySubItemWithRelationsSchema } from './InventorySubItemSchema'
import { DepartmentWithRelationsSchema } from './DepartmentSchema'

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
  departmentId: z.string(),
})

export type InventoryItem = z.infer<typeof InventoryItemSchema>

/////////////////////////////////////////
// INVENTORY ITEM RELATION SCHEMA
/////////////////////////////////////////

export type InventoryItemRelations = {
  inventorySubItems: InventorySubItemWithRelations[];
  department: DepartmentWithRelations;
};

export type InventoryItemWithRelations = z.infer<typeof InventoryItemSchema> & InventoryItemRelations

export const InventoryItemWithRelationsSchema: z.ZodType<InventoryItemWithRelations> = InventoryItemSchema.merge(z.object({
  inventorySubItems: z.lazy(() => InventorySubItemWithRelationsSchema).array(),
  department: z.lazy(() => DepartmentWithRelationsSchema),
}))

export default InventoryItemSchema;
