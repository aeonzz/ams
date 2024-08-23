import { z } from 'zod';
import type { RequestWithRelations } from './RequestSchema'
import { RequestWithRelationsSchema } from './RequestSchema'

/////////////////////////////////////////
// RESOURCE REQUEST SCHEMA
/////////////////////////////////////////

export const ResourceRequestSchema = z.object({
  id: z.string(),
  itemType: z.string(),
  quantity: z.number().int(),
  returnDate: z.coerce.date(),
  requestId: z.string(),
})

export type ResourceRequest = z.infer<typeof ResourceRequestSchema>

/////////////////////////////////////////
// RESOURCE REQUEST RELATION SCHEMA
/////////////////////////////////////////

export type ResourceRequestRelations = {
  request: RequestWithRelations;
};

export type ResourceRequestWithRelations = z.infer<typeof ResourceRequestSchema> & ResourceRequestRelations

export const ResourceRequestWithRelationsSchema: z.ZodType<ResourceRequestWithRelations> = ResourceRequestSchema.merge(z.object({
  request: z.lazy(() => RequestWithRelationsSchema),
}))

export default ResourceRequestSchema;
