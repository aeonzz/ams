import { z } from 'zod';
import type { UserWithRelations } from './UserSchema'
import type { RequestWithRelations } from './RequestSchema'
import type { VenueWithRelations } from './VenueSchema'
import { UserWithRelationsSchema } from './UserSchema'
import { RequestWithRelationsSchema } from './RequestSchema'
import { VenueWithRelationsSchema } from './VenueSchema'

/////////////////////////////////////////
// VENUE REQUEST SCHEMA
/////////////////////////////////////////

export const VenueRequestSchema = z.object({
  id: z.string(),
  notes: z.string().nullable(),
  purpose: z.string(),
  setupRequirements: z.string(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  reviewedBy: z.string().nullable(),
  requestId: z.string(),
  venueId: z.string(),
})

export type VenueRequest = z.infer<typeof VenueRequestSchema>

/////////////////////////////////////////
// VENUE REQUEST RELATION SCHEMA
/////////////////////////////////////////

export type VenueRequestRelations = {
  reviewer?: UserWithRelations | null;
  request: RequestWithRelations;
  venue: VenueWithRelations;
};

export type VenueRequestWithRelations = z.infer<typeof VenueRequestSchema> & VenueRequestRelations

export const VenueRequestWithRelationsSchema: z.ZodType<VenueRequestWithRelations> = VenueRequestSchema.merge(z.object({
  reviewer: z.lazy(() => UserWithRelationsSchema).nullable(),
  request: z.lazy(() => RequestWithRelationsSchema),
  venue: z.lazy(() => VenueWithRelationsSchema),
}))

export default VenueRequestSchema;
