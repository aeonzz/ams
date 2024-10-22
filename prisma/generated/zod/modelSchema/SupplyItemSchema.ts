import { z } from 'zod';
import { SupplyItemStatusSchema } from '../inputTypeSchemas/SupplyItemStatusSchema'
import type { SupplyItemCategoryWithRelations } from './SupplyItemCategorySchema'
import type { DepartmentWithRelations } from './DepartmentSchema'
import type { SupplyRequestItemWithRelations } from './SupplyRequestItemSchema'
import { SupplyItemCategoryWithRelationsSchema } from './SupplyItemCategorySchema'
import { DepartmentWithRelationsSchema } from './DepartmentSchema'
import { SupplyRequestItemWithRelationsSchema } from './SupplyRequestItemSchema'

/////////////////////////////////////////
// SUPPLY ITEM SCHEMA
/////////////////////////////////////////

export const SupplyItemSchema = z.object({
  status: SupplyItemStatusSchema,
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  imageUrl: z.string(),
  quantity: z.number().int(),
  unit: z.string(),
  lowStockThreshold: z.number().int(),
  expirationDate: z.coerce.date().nullable(),
  categoryId: z.string(),
  departmentId: z.string(),
  createdAt: z.coerce.date(),
  isArchived: z.boolean(),
  updatedAt: z.coerce.date(),
})

export type SupplyItem = z.infer<typeof SupplyItemSchema>

/////////////////////////////////////////
// SUPPLY ITEM RELATION SCHEMA
/////////////////////////////////////////

export type SupplyItemRelations = {
  category: SupplyItemCategoryWithRelations;
  department: DepartmentWithRelations;
  supplyRequestItems: SupplyRequestItemWithRelations[];
};

export type SupplyItemWithRelations = z.infer<typeof SupplyItemSchema> & SupplyItemRelations

export const SupplyItemWithRelationsSchema: z.ZodType<SupplyItemWithRelations> = SupplyItemSchema.merge(z.object({
  category: z.lazy(() => SupplyItemCategoryWithRelationsSchema),
  department: z.lazy(() => DepartmentWithRelationsSchema),
  supplyRequestItems: z.lazy(() => SupplyRequestItemWithRelationsSchema).array(),
}))

export default SupplyItemSchema;
