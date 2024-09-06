import { z } from 'zod';
import type { JobRequestWithRelations } from './JobRequestSchema'
import { JobRequestWithRelationsSchema } from './JobRequestSchema'

/////////////////////////////////////////
// SECTION SCHEMA
/////////////////////////////////////////

export const SectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  isArchived: z.boolean(),
})

export type Section = z.infer<typeof SectionSchema>

/////////////////////////////////////////
// SECTION RELATION SCHEMA
/////////////////////////////////////////

export type SectionRelations = {
  jobRequests: JobRequestWithRelations[];
};

export type SectionWithRelations = z.infer<typeof SectionSchema> & SectionRelations

export const SectionWithRelationsSchema: z.ZodType<SectionWithRelations> = SectionSchema.merge(z.object({
  jobRequests: z.lazy(() => JobRequestWithRelationsSchema).array(),
}))

export default SectionSchema;
