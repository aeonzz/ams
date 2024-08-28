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
  quantity: z.number().int(),
  dateNeeded: z.coerce.date(),
  returnDate: z.coerce.date(),
  purpose: z.string().nullable(),
  requestId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type ReturnableRequest = z.infer<typeof ReturnableRequestSchema>

/////////////////////////////////////////
// RETURNABLE REQUEST RELATION SCHEMA
/////////////////////////////////////////

export type ReturnableRequestRelations = {
  items: ReturnableItemWithRelations[];
  request: RequestWithRelations;
};

export type ReturnableRequestWithRelations = z.infer<typeof ReturnableRequestSchema> & ReturnableRequestRelations

export const ReturnableRequestWithRelationsSchema: z.ZodType<ReturnableRequestWithRelations> = ReturnableRequestSchema.merge(z.object({
  items: z.lazy(() => ReturnableItemWithRelationsSchema).array(),
  request: z.lazy(() => RequestWithRelationsSchema),
}))

export default ReturnableRequestSchema;
