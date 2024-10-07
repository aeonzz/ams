import { z } from 'zod';
import { JsonValueSchema } from '../inputTypeSchemas/JsonValueSchema'
import { VenueTypeSchema } from '../inputTypeSchemas/VenueTypeSchema'
import { VenueStatusSchema } from '../inputTypeSchemas/VenueStatusSchema'
import type { JsonValueType } from '../inputTypeSchemas/JsonValueSchema';
import type { DepartmentWithRelations } from './DepartmentSchema'
import type { VenueRequestWithRelations } from './VenueRequestSchema'
import { DepartmentWithRelationsSchema } from './DepartmentSchema'
import { VenueRequestWithRelationsSchema } from './VenueRequestSchema'

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
  features: JsonValueSchema.nullable(),
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

export type VenueWithRelations = Omit<z.infer<typeof VenueSchema>, "features"> & {
  features?: JsonValueType | null;
} & VenueRelations

export const VenueWithRelationsSchema: z.ZodType<VenueWithRelations> = VenueSchema.merge(z.object({
  department: z.lazy(() => DepartmentWithRelationsSchema),
  requests: z.lazy(() => VenueRequestWithRelationsSchema).array(),
}))

export default VenueSchema;
