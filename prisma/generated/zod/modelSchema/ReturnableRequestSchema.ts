import { z } from 'zod';
import { RequestStatusSchema } from '../inputTypeSchemas/RequestStatusSchema'
import type { ItemReservationWithRelations } from './ItemReservationSchema'
import type { RequestWithRelations } from './RequestSchema'
import { ItemReservationWithRelationsSchema } from './ItemReservationSchema'
import { RequestWithRelationsSchema } from './RequestSchema'

/////////////////////////////////////////
// RETURNABLE REQUEST SCHEMA
/////////////////////////////////////////

export const ReturnableRequestSchema = z.object({
  status: RequestStatusSchema,
  id: z.string(),
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
  items: ItemReservationWithRelations[];
  request: RequestWithRelations;
};

export type ReturnableRequestWithRelations = z.infer<typeof ReturnableRequestSchema> & ReturnableRequestRelations

export const ReturnableRequestWithRelationsSchema: z.ZodType<ReturnableRequestWithRelations> = ReturnableRequestSchema.merge(z.object({
  items: z.lazy(() => ItemReservationWithRelationsSchema).array(),
  request: z.lazy(() => RequestWithRelationsSchema),
}))

export default ReturnableRequestSchema;
