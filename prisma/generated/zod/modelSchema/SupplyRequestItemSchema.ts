import { z } from 'zod';
import type { SupplyRequestWithRelations } from './SupplyRequestSchema'
import type { SupplyItemWithRelations } from './SupplyItemSchema'
import { SupplyRequestWithRelationsSchema } from './SupplyRequestSchema'
import { SupplyItemWithRelationsSchema } from './SupplyItemSchema'

/////////////////////////////////////////
// SUPPLY REQUEST ITEM SCHEMA
/////////////////////////////////////////

export const SupplyRequestItemSchema = z.object({
  id: z.string(),
  supplyRequestId: z.string(),
  supplyItemId: z.string(),
  quantity: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type SupplyRequestItem = z.infer<typeof SupplyRequestItemSchema>

/////////////////////////////////////////
// SUPPLY REQUEST ITEM RELATION SCHEMA
/////////////////////////////////////////

export type SupplyRequestItemRelations = {
  supplyRequest: SupplyRequestWithRelations;
  supplyItem: SupplyItemWithRelations;
};

export type SupplyRequestItemWithRelations = z.infer<typeof SupplyRequestItemSchema> & SupplyRequestItemRelations

export const SupplyRequestItemWithRelationsSchema: z.ZodType<SupplyRequestItemWithRelations> = SupplyRequestItemSchema.merge(z.object({
  supplyRequest: z.lazy(() => SupplyRequestWithRelationsSchema),
  supplyItem: z.lazy(() => SupplyItemWithRelationsSchema),
}))

export default SupplyRequestItemSchema;
