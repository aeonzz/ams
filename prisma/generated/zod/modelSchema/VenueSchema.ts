import { z } from 'zod';
import { VenueStatusSchema } from '../inputTypeSchemas/VenueStatusSchema'
import type { DepartmentWithRelations } from './DepartmentSchema'
import type { VenueRequestWithRelations } from './VenueRequestSchema'
import { DepartmentWithRelationsSchema } from './DepartmentSchema'
import { VenueRequestWithRelationsSchema } from './VenueRequestSchema'

/////////////////////////////////////////
// VENUE SCHEMA
/////////////////////////////////////////

export const VenueSchema = z.object({
  status: VenueStatusSchema,
  id: z.string(),
  name: z.string(),
  location: z.string(),
  capacity: z.number().int(),
  imageUrl: z.string(),
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
};

export type VenueWithRelations = z.infer<typeof VenueSchema> & VenueRelations

export const VenueWithRelationsSchema: z.ZodType<VenueWithRelations> = VenueSchema.merge(z.object({
  department: z.lazy(() => DepartmentWithRelationsSchema),
  requests: z.lazy(() => VenueRequestWithRelationsSchema).array(),
}))

export default VenueSchema;
