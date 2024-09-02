import { z } from 'zod';
import type { InventorySubItemWithRelations } from './InventorySubItemSchema'
import type { RequestWithRelations } from './RequestSchema'
import { InventorySubItemWithRelationsSchema } from './InventorySubItemSchema'
import { RequestWithRelationsSchema } from './RequestSchema'

/////////////////////////////////////////
// RETURNABLE REQUEST SCHEMA
/////////////////////////////////////////

export const ReturnableRequestSchema = z.object({
  id: z.string(),
  itemId: z.string(),
  dateAndTimeNeeded: z.coerce.date(),
  returnDateAndTime: z.coerce.date(),
  purpose: z.string(),
  quantity: z.number().int(),
  requestId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type ReturnableRequest = z.infer<typeof ReturnableRequestSchema>

/////////////////////////////////////////
// RETURNABLE REQUEST RELATION SCHEMA
/////////////////////////////////////////

export type ReturnableRequestRelations = {
  item: InventorySubItemWithRelations;
  request: RequestWithRelations;
};

export type ReturnableRequestWithRelations = z.infer<typeof ReturnableRequestSchema> & ReturnableRequestRelations

export const ReturnableRequestWithRelationsSchema: z.ZodType<ReturnableRequestWithRelations> = ReturnableRequestSchema.merge(z.object({
  item: z.lazy(() => InventorySubItemWithRelationsSchema),
  request: z.lazy(() => RequestWithRelationsSchema),
}))

export default ReturnableRequestSchema;
