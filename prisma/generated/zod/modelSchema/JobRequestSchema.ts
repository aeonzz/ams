import { z } from 'zod';

/////////////////////////////////////////
// JOB REQUEST SCHEMA
/////////////////////////////////////////

export const JobRequestSchema = z.object({
  id: z.string(),
  requestId: z.string(),
  jobType: z.string(),
  description: z.string().nullable(),
  itemType: z.string().nullable(),
})

export type JobRequest = z.infer<typeof JobRequestSchema>

export default JobRequestSchema;
