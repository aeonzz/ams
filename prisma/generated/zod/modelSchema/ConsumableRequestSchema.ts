import { z } from 'zod';
import { RequestStatusSchema } from '../inputTypeSchemas/RequestStatusSchema'
import type { ConsumableItemWithRelations } from './ConsumableItemSchema'
import type { RequestWithRelations } from './RequestSchema'
import { ConsumableItemWithRelationsSchema } from './ConsumableItemSchema'
import { RequestWithRelationsSchema } from './RequestSchema'

/////////////////////////////////////////
// CONSUMABLE REQUEST SCHEMA
/////////////////////////////////////////

export const ConsumableRequestSchema = z.object({
  status: RequestStatusSchema,
  id: z.string(),
  quantity: z.number().int(),
  dateNeeded: z.coerce.date(),
  purpose: z.string().nullable(),
  requestId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type ConsumableRequest = z.infer<typeof ConsumableRequestSchema>

/////////////////////////////////////////
// CONSUMABLE REQUEST RELATION SCHEMA
/////////////////////////////////////////

export type ConsumableRequestRelations = {
  items: ConsumableItemWithRelations[];
  request: RequestWithRelations;
};

export type ConsumableRequestWithRelations = z.infer<typeof ConsumableRequestSchema> & ConsumableRequestRelations

export const ConsumableRequestWithRelationsSchema: z.ZodType<ConsumableRequestWithRelations> = ConsumableRequestSchema.merge(z.object({
  items: z.lazy(() => ConsumableItemWithRelationsSchema).array(),
  request: z.lazy(() => RequestWithRelationsSchema),
}))

export default ConsumableRequestSchema;
