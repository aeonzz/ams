import { z } from 'zod';
import { RequestStatusSchema } from '../inputTypeSchemas/RequestStatusSchema'
import type { ReturnableItemWithRelations } from './ReturnableItemSchema'
import type { RequestWithRelations } from './RequestSchema'
import { ReturnableItemWithRelationsSchema } from './ReturnableItemSchema'
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
  requestId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type ReturnableRequest = z.infer<typeof ReturnableRequestSchema>

/////////////////////////////////////////
// RETURNABLE REQUEST RELATION SCHEMA
/////////////////////////////////////////

export type ReturnableRequestRelations = {
  item: ReturnableItemWithRelations;
  request: RequestWithRelations;
};

export type ReturnableRequestWithRelations = z.infer<typeof ReturnableRequestSchema> & ReturnableRequestRelations

export const ReturnableRequestWithRelationsSchema: z.ZodType<ReturnableRequestWithRelations> = ReturnableRequestSchema.merge(z.object({
  item: z.lazy(() => ReturnableItemWithRelationsSchema),
  request: z.lazy(() => RequestWithRelationsSchema),
}))

export default ReturnableRequestSchema;
