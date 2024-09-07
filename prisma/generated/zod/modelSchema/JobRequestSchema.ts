import { z } from 'zod';
import { JobTypeSchema } from '../inputTypeSchemas/JobTypeSchema'
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
  jobType: JobTypeSchema,
  status: JobStatusSchema,
  id: z.string(),
  description: z.string(),
  dueDate: z.coerce.date(),
  estimatedTime: z.number().int().nullable(),
  startDate: z.coerce.date().nullable(),
  endDate: z.coerce.date().nullable(),
  costEstimate: z.number().nullable(),
  actualCost: z.number().nullable(),
  progressNotes: z.string().nullable(),
  requestId: z.string(),
  sectionId: z.string(),
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
  section: SectionWithRelations;
  assignedUser?: UserWithRelations | null;
};

export type JobRequestWithRelations = z.infer<typeof JobRequestSchema> & JobRequestRelations

export const JobRequestWithRelationsSchema: z.ZodType<JobRequestWithRelations> = JobRequestSchema.merge(z.object({
  files: z.lazy(() => FileWithRelationsSchema).array(),
  request: z.lazy(() => RequestWithRelationsSchema),
  section: z.lazy(() => SectionWithRelationsSchema),
  assignedUser: z.lazy(() => UserWithRelationsSchema).nullable(),
}))

export default JobRequestSchema;
