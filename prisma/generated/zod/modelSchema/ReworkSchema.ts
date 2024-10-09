import { z } from 'zod';
import type { JobRequestWithRelations } from './JobRequestSchema'
import { JobRequestWithRelationsSchema } from './JobRequestSchema'

/////////////////////////////////////////
// REWORK SCHEMA
/////////////////////////////////////////

export const ReworkSchema = z.object({
  id: z.string(),
  jobRequestId: z.string(),
  reworkStartDate: z.coerce.date().nullable(),
  reworkEndDate: z.coerce.date().nullable(),
  rejectionReason: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Rework = z.infer<typeof ReworkSchema>

/////////////////////////////////////////
// REWORK RELATION SCHEMA
/////////////////////////////////////////

export type ReworkRelations = {
  jobRequest: JobRequestWithRelations;
};

export type ReworkWithRelations = z.infer<typeof ReworkSchema> & ReworkRelations

export const ReworkWithRelationsSchema: z.ZodType<ReworkWithRelations> = ReworkSchema.merge(z.object({
  jobRequest: z.lazy(() => JobRequestWithRelationsSchema),
}))

export default ReworkSchema;
