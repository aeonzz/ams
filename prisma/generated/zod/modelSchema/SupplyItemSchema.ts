import { z } from 'zod';
import { SupplyItemStatusSchema } from '../inputTypeSchemas/SupplyItemStatusSchema'
import { SupplyItemCategorySchema } from '../inputTypeSchemas/SupplyItemCategorySchema'
import type { SupplyRequestItemWithRelations } from './SupplyRequestItemSchema'
import { SupplyRequestItemWithRelationsSchema } from './SupplyRequestItemSchema'

/////////////////////////////////////////
// SUPPLY ITEM SCHEMA
/////////////////////////////////////////

export const SupplyItemSchema = z.object({
  status: SupplyItemStatusSchema,
  category: SupplyItemCategorySchema,
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  imageUrl: z.string().nullable(),
  quantity: z.number().int(),
  unit: z.string(),
  lowStockThreshold: z.number().int(),
  expirationDate: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type SupplyItem = z.infer<typeof SupplyItemSchema>

/////////////////////////////////////////
// SUPPLY ITEM RELATION SCHEMA
/////////////////////////////////////////

export type SupplyItemRelations = {
  supplyRequestItems: SupplyRequestItemWithRelations[];
};

export type SupplyItemWithRelations = z.infer<typeof SupplyItemSchema> & SupplyItemRelations

export const SupplyItemWithRelationsSchema: z.ZodType<SupplyItemWithRelations> = SupplyItemSchema.merge(z.object({
  supplyRequestItems: z.lazy(() => SupplyRequestItemWithRelationsSchema).array(),
}))

export default SupplyItemSchema;
