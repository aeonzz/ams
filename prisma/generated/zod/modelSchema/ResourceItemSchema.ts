import { z } from 'zod';
import { ItemTypeSchema } from '../inputTypeSchemas/ItemTypeSchema'
import { ItemStatusSchema } from '../inputTypeSchemas/ItemStatusSchema'
import type { ResourceRequestWithRelations } from './ResourceRequestSchema'
import { ResourceRequestWithRelationsSchema } from './ResourceRequestSchema'

/////////////////////////////////////////
// RESOURCE ITEM SCHEMA
/////////////////////////////////////////

export const ResourceItemSchema = z.object({
  itemType: ItemTypeSchema,
  status: ItemStatusSchema,
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  quantity: z.number().int(),
  imageUrl: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type ResourceItem = z.infer<typeof ResourceItemSchema>

/////////////////////////////////////////
// RESOURCE ITEM RELATION SCHEMA
/////////////////////////////////////////

export type ResourceItemRelations = {
  requests: ResourceRequestWithRelations[];
};

export type ResourceItemWithRelations = z.infer<typeof ResourceItemSchema> & ResourceItemRelations

export const ResourceItemWithRelationsSchema: z.ZodType<ResourceItemWithRelations> = ResourceItemSchema.merge(z.object({
  requests: z.lazy(() => ResourceRequestWithRelationsSchema).array(),
}))

export default ResourceItemSchema;
