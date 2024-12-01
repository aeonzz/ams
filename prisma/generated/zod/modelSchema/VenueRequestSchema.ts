import { z } from 'zod';
import type { DepartmentWithRelations } from './DepartmentSchema'
import type { RequestWithRelations } from './RequestSchema'
import type { VenueWithRelations } from './VenueSchema'
import { DepartmentWithRelationsSchema } from './DepartmentSchema'
import { RequestWithRelationsSchema } from './RequestSchema'
import { VenueWithRelationsSchema } from './VenueSchema'

/////////////////////////////////////////
// VENUE REQUEST SCHEMA
/////////////////////////////////////////

export const VenueRequestSchema = z.object({
  id: z.string(),
  departmentId: z.string(),
  notes: z.string().nullable(),
  purpose: z.string(),
  setupRequirements: z.string().array(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  actualStart: z.coerce.date().nullable(),
  inProgress: z.boolean(),
  requestId: z.string(),
  venueId: z.string(),
  approvedByHead: z.boolean().nullable(),
  notifyHead: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type VenueRequest = z.infer<typeof VenueRequestSchema>

/////////////////////////////////////////
// VENUE REQUEST RELATION SCHEMA
/////////////////////////////////////////

export type VenueRequestRelations = {
  department: DepartmentWithRelations;
  request: RequestWithRelations;
  venue: VenueWithRelations;
};

export type VenueRequestWithRelations = z.infer<typeof VenueRequestSchema> & VenueRequestRelations

export const VenueRequestWithRelationsSchema: z.ZodType<VenueRequestWithRelations> = VenueRequestSchema.merge(z.object({
  department: z.lazy(() => DepartmentWithRelationsSchema),
  request: z.lazy(() => RequestWithRelationsSchema),
  venue: z.lazy(() => VenueWithRelationsSchema),
}))

export default VenueRequestSchema;
