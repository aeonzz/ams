import { z } from 'zod';

/////////////////////////////////////////
// RESOURCE REQUEST SCHEMA
/////////////////////////////////////////

export const ResourceRequestSchema = z.object({
  id: z.string(),
  requestId: z.string(),
  itemType: z.string(),
  quantity: z.number().int(),
  returnDate: z.coerce.date(),
})

export type ResourceRequest = z.infer<typeof ResourceRequestSchema>

export default ResourceRequestSchema;
