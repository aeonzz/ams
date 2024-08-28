import { z } from 'zod';
import { ReturnableItemStatusSchema } from '../inputTypeSchemas/ReturnableItemStatusSchema'
import type { ReturnableRequestWithRelations } from './ReturnableRequestSchema'
import { ReturnableRequestWithRelationsSchema } from './ReturnableRequestSchema'

/////////////////////////////////////////
// RETURNABLE ITEM SCHEMA
/////////////////////////////////////////

export const ReturnableItemSchema = z.object({
  status: ReturnableItemStatusSchema,
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  imageUrl: z.string().nullable(),
  serialNumber: z.string().nullable(),
  lastMaintenance: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  returnableRequestId: z.string().nullable(),
})

export type ReturnableItem = z.infer<typeof ReturnableItemSchema>

/////////////////////////////////////////
// RETURNABLE ITEM RELATION SCHEMA
/////////////////////////////////////////

export type ReturnableItemRelations = {
  returnableRequest?: ReturnableRequestWithRelations | null;
};

export type ReturnableItemWithRelations = z.infer<typeof ReturnableItemSchema> & ReturnableItemRelations

export const ReturnableItemWithRelationsSchema: z.ZodType<ReturnableItemWithRelations> = ReturnableItemSchema.merge(z.object({
  returnableRequest: z.lazy(() => ReturnableRequestWithRelationsSchema).nullable(),
}))

export default ReturnableItemSchema;
