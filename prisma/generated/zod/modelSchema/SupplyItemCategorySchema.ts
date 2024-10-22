import { z } from 'zod';
import type { SupplyItemWithRelations } from './SupplyItemSchema'
import { SupplyItemWithRelationsSchema } from './SupplyItemSchema'

/////////////////////////////////////////
// SUPPLY ITEM CATEGORY SCHEMA
/////////////////////////////////////////

export const SupplyItemCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.coerce.date(),
  isArchived: z.boolean(),
  updatedAt: z.coerce.date(),
})

export type SupplyItemCategory = z.infer<typeof SupplyItemCategorySchema>

/////////////////////////////////////////
// SUPPLY ITEM CATEGORY RELATION SCHEMA
/////////////////////////////////////////

export type SupplyItemCategoryRelations = {
  supplyItem: SupplyItemWithRelations[];
};

export type SupplyItemCategoryWithRelations = z.infer<typeof SupplyItemCategorySchema> & SupplyItemCategoryRelations

export const SupplyItemCategoryWithRelationsSchema: z.ZodType<SupplyItemCategoryWithRelations> = SupplyItemCategorySchema.merge(z.object({
  supplyItem: z.lazy(() => SupplyItemWithRelationsSchema).array(),
}))

export default SupplyItemCategorySchema;
