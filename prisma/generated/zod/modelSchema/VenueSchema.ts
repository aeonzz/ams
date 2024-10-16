import { z } from 'zod';
import { VenueTypeSchema } from '../inputTypeSchemas/VenueTypeSchema'
import { VenueStatusSchema } from '../inputTypeSchemas/VenueStatusSchema'
import type { DepartmentWithRelations } from './DepartmentSchema'
import type { VenueRequestWithRelations } from './VenueRequestSchema'
import type { VenueSetupRequirementWithRelations } from './VenueSetupRequirementSchema'
import { DepartmentWithRelationsSchema } from './DepartmentSchema'
import { VenueRequestWithRelationsSchema } from './VenueRequestSchema'
import { VenueSetupRequirementWithRelationsSchema } from './VenueSetupRequirementSchema'

/////////////////////////////////////////
// VENUE SCHEMA
/////////////////////////////////////////

export const VenueSchema = z.object({
  venueType: VenueTypeSchema,
  status: VenueStatusSchema,
  id: z.string(),
  name: z.string(),
  location: z.string(),
  capacity: z.number().int(),
  imageUrl: z.string(),
  rulesAndRegulations: z.string().nullable(),
  isArchived: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  departmentId: z.string(),
})

export type Venue = z.infer<typeof VenueSchema>

/////////////////////////////////////////
// VENUE RELATION SCHEMA
/////////////////////////////////////////

export type VenueRelations = {
  department: DepartmentWithRelations;
  requests: VenueRequestWithRelations[];
  venueSetupRequirement: VenueSetupRequirementWithRelations[];
};

export type VenueWithRelations = z.infer<typeof VenueSchema> & VenueRelations

export const VenueWithRelationsSchema: z.ZodType<VenueWithRelations> = VenueSchema.merge(z.object({
  department: z.lazy(() => DepartmentWithRelationsSchema),
  requests: z.lazy(() => VenueRequestWithRelationsSchema).array(),
  venueSetupRequirement: z.lazy(() => VenueSetupRequirementWithRelationsSchema).array(),
}))

export default VenueSchema;
