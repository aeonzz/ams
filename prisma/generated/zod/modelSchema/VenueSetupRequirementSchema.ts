import { z } from 'zod';
import type { VenueWithRelations } from './VenueSchema'
import { VenueWithRelationsSchema } from './VenueSchema'

/////////////////////////////////////////
// VENUE SETUP REQUIREMENT SCHEMA
/////////////////////////////////////////

export const VenueSetupRequirementSchema = z.object({
  id: z.string(),
  venueId: z.string(),
  available: z.boolean(),
  name: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type VenueSetupRequirement = z.infer<typeof VenueSetupRequirementSchema>

/////////////////////////////////////////
// VENUE SETUP REQUIREMENT RELATION SCHEMA
/////////////////////////////////////////

export type VenueSetupRequirementRelations = {
  venue: VenueWithRelations;
};

export type VenueSetupRequirementWithRelations = z.infer<typeof VenueSetupRequirementSchema> & VenueSetupRequirementRelations

export const VenueSetupRequirementWithRelationsSchema: z.ZodType<VenueSetupRequirementWithRelations> = VenueSetupRequirementSchema.merge(z.object({
  venue: z.lazy(() => VenueWithRelationsSchema),
}))

export default VenueSetupRequirementSchema;
