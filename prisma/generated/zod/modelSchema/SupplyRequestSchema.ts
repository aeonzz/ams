import { z } from 'zod';
import type { RequestWithRelations } from './RequestSchema'
import type { SupplyRequestItemWithRelations } from './SupplyRequestItemSchema'
import { RequestWithRelationsSchema } from './RequestSchema'
import { SupplyRequestItemWithRelationsSchema } from './SupplyRequestItemSchema'

/////////////////////////////////////////
// SUPPLY REQUEST SCHEMA
/////////////////////////////////////////

export const SupplyRequestSchema = z.object({
  id: z.string(),
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
  request: RequestWithRelations;
  items: SupplyRequestItemWithRelations[];
};

export type SupplyRequestWithRelations = z.infer<typeof SupplyRequestSchema> & SupplyRequestRelations

export const SupplyRequestWithRelationsSchema: z.ZodType<SupplyRequestWithRelations> = SupplyRequestSchema.merge(z.object({
  request: z.lazy(() => RequestWithRelationsSchema),
  items: z.lazy(() => SupplyRequestItemWithRelationsSchema).array(),
}))

export default SupplyRequestSchema;
