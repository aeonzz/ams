import { z } from 'zod';
import type { RequestWithRelations } from './RequestSchema'
import { RequestWithRelationsSchema } from './RequestSchema'

/////////////////////////////////////////
// VENUE REQUEST SCHEMA
/////////////////////////////////////////

export const VenueRequestSchema = z.object({
  id: z.string(),
  notes: z.string().nullable(),
  purpose: z.string(),
  venueName: z.string(),
  setupRequirements: z.string(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  requestId: z.string(),
})

export type VenueRequest = z.infer<typeof VenueRequestSchema>

/////////////////////////////////////////
// VENUE REQUEST RELATION SCHEMA
/////////////////////////////////////////

export type VenueRequestRelations = {
  request: RequestWithRelations;
};

export type VenueRequestWithRelations = z.infer<typeof VenueRequestSchema> & VenueRequestRelations

export const VenueRequestWithRelationsSchema: z.ZodType<VenueRequestWithRelations> = VenueRequestSchema.merge(z.object({
  request: z.lazy(() => RequestWithRelationsSchema),
}))

export default VenueRequestSchema;
