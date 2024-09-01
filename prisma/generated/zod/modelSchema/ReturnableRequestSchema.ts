import { z } from 'zod';
import { RequestStatusSchema } from '../inputTypeSchemas/RequestStatusSchema'
import type { InventoryItemWithRelations } from './InventoryItemSchema'
import type { RequestWithRelations } from './RequestSchema'
import { InventoryItemWithRelationsSchema } from './InventoryItemSchema'
import { RequestWithRelationsSchema } from './RequestSchema'

/////////////////////////////////////////
// RETURNABLE REQUEST SCHEMA
/////////////////////////////////////////

export const ReturnableRequestSchema = z.object({
  status: RequestStatusSchema,
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
  item: InventoryItemWithRelations;
  request: RequestWithRelations;
};

export type ReturnableRequestWithRelations = z.infer<typeof ReturnableRequestSchema> & ReturnableRequestRelations

export const ReturnableRequestWithRelationsSchema: z.ZodType<ReturnableRequestWithRelations> = ReturnableRequestSchema.merge(z.object({
  item: z.lazy(() => InventoryItemWithRelationsSchema),
  request: z.lazy(() => RequestWithRelationsSchema),
}))

export default ReturnableRequestSchema;
