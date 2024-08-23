import { z } from 'zod';
import type { FileWithRelations } from './FileSchema'
import type { RequestWithRelations } from './RequestSchema'
import { FileWithRelationsSchema } from './FileSchema'
import { RequestWithRelationsSchema } from './RequestSchema'

/////////////////////////////////////////
// JOB REQUEST SCHEMA
/////////////////////////////////////////

export const JobRequestSchema = z.object({
  id: z.string(),
  jobType: z.string(),
  category: z.string(),
  name: z.string(),
  assignTo: z.string(),
  requestId: z.string(),
})

export type JobRequest = z.infer<typeof JobRequestSchema>

/////////////////////////////////////////
// JOB REQUEST RELATION SCHEMA
/////////////////////////////////////////

export type JobRequestRelations = {
  files: FileWithRelations[];
  request: RequestWithRelations;
};

export type JobRequestWithRelations = z.infer<typeof JobRequestSchema> & JobRequestRelations

export const JobRequestWithRelationsSchema: z.ZodType<JobRequestWithRelations> = JobRequestSchema.merge(z.object({
  files: z.lazy(() => FileWithRelationsSchema).array(),
  request: z.lazy(() => RequestWithRelationsSchema),
}))

export default JobRequestSchema;
