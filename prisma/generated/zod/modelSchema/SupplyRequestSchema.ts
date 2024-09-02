import { z } from 'zod';
import type { SupplyItemWithRelations } from './SupplyItemSchema'
import type { RequestWithRelations } from './RequestSchema'
import { SupplyItemWithRelationsSchema } from './SupplyItemSchema'
import { RequestWithRelationsSchema } from './RequestSchema'

/////////////////////////////////////////
// SUPPLY REQUEST SCHEMA
/////////////////////////////////////////

export const SupplyRequestSchema = z.object({
  id: z.string(),
  quantity: z.number().int(),
  dateAndTimeNeeded: z.coerce.date(),
  purpose: z.string(),
  requestId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type SupplyRequest = z.infer<typeof SupplyRequestSchema>

/////////////////////////////////////////
// SUPPLY REQUEST RELATION SCHEMA
/////////////////////////////////////////

export type SupplyRequestRelations = {
  items: SupplyItemWithRelations[];
  request: RequestWithRelations;
};

export type SupplyRequestWithRelations = z.infer<typeof SupplyRequestSchema> & SupplyRequestRelations

export const SupplyRequestWithRelationsSchema: z.ZodType<SupplyRequestWithRelations> = SupplyRequestSchema.merge(z.object({
  items: z.lazy(() => SupplyItemWithRelationsSchema).array(),
  request: z.lazy(() => RequestWithRelationsSchema),
}))

export default SupplyRequestSchema;
