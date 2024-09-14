import { z } from 'zod';
import type { JobRequestWithRelations } from './JobRequestSchema'
import type { UserWithRelations } from './UserSchema'
import { JobRequestWithRelationsSchema } from './JobRequestSchema'
import { UserWithRelationsSchema } from './UserSchema'

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
  user: UserWithRelations[];
};

export type SectionWithRelations = z.infer<typeof SectionSchema> & SectionRelations

export const SectionWithRelationsSchema: z.ZodType<SectionWithRelations> = SectionSchema.merge(z.object({
  jobRequests: z.lazy(() => JobRequestWithRelationsSchema).array(),
  user: z.lazy(() => UserWithRelationsSchema).array(),
}))

export default SectionSchema;
