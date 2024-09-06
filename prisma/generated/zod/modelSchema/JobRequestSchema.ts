import { z } from 'zod';
import { JobStatusSchema } from '../inputTypeSchemas/JobStatusSchema'
import type { FileWithRelations } from './FileSchema'
import type { RequestWithRelations } from './RequestSchema'
import type { SectionWithRelations } from './SectionSchema'
import type { UserWithRelations } from './UserSchema'
import { FileWithRelationsSchema } from './FileSchema'
import { RequestWithRelationsSchema } from './RequestSchema'
import { SectionWithRelationsSchema } from './SectionSchema'
import { UserWithRelationsSchema } from './UserSchema'

/////////////////////////////////////////
// JOB REQUEST SCHEMA
/////////////////////////////////////////

export const JobRequestSchema = z.object({
  status: JobStatusSchema,
  id: z.string(),
  notes: z.string(),
  dueDate: z.coerce.date(),
  jobType: z.string(),
  requestId: z.string(),
  sectionId: z.string().nullable(),
  assignedTo: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type JobRequest = z.infer<typeof JobRequestSchema>

/////////////////////////////////////////
// JOB REQUEST RELATION SCHEMA
/////////////////////////////////////////

export type JobRequestRelations = {
  files: FileWithRelations[];
  request: RequestWithRelations;
  section?: SectionWithRelations | null;
  assignedUser?: UserWithRelations | null;
};

export type JobRequestWithRelations = z.infer<typeof JobRequestSchema> & JobRequestRelations

export const JobRequestWithRelationsSchema: z.ZodType<JobRequestWithRelations> = JobRequestSchema.merge(z.object({
  files: z.lazy(() => FileWithRelationsSchema).array(),
  request: z.lazy(() => RequestWithRelationsSchema),
  section: z.lazy(() => SectionWithRelationsSchema).nullable(),
  assignedUser: z.lazy(() => UserWithRelationsSchema).nullable(),
}))

export default JobRequestSchema;
