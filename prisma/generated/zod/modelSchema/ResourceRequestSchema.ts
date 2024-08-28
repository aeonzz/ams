import { z } from 'zod';
import type { ResourceItemWithRelations } from './ResourceItemSchema'
import type { RequestWithRelations } from './RequestSchema'
import { ResourceItemWithRelationsSchema } from './ResourceItemSchema'
import { RequestWithRelationsSchema } from './RequestSchema'

/////////////////////////////////////////
// RESOURCE REQUEST SCHEMA
/////////////////////////////////////////

export const ResourceRequestSchema = z.object({
  id: z.string(),
  quantity: z.number().int(),
  dateNeeded: z.coerce.date(),
  returnDate: z.coerce.date().nullable(),
  purpose: z.string().nullable(),
  requestId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type ResourceRequest = z.infer<typeof ResourceRequestSchema>

/////////////////////////////////////////
// RESOURCE REQUEST RELATION SCHEMA
/////////////////////////////////////////

export type ResourceRequestRelations = {
  resourceItems: ResourceItemWithRelations[];
  request: RequestWithRelations;
};

export type ResourceRequestWithRelations = z.infer<typeof ResourceRequestSchema> & ResourceRequestRelations

export const ResourceRequestWithRelationsSchema: z.ZodType<ResourceRequestWithRelations> = ResourceRequestSchema.merge(z.object({
  resourceItems: z.lazy(() => ResourceItemWithRelationsSchema).array(),
  request: z.lazy(() => RequestWithRelationsSchema),
}))

export default ResourceRequestSchema;
