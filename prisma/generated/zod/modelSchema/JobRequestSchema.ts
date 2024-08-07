import { z } from 'zod';

/////////////////////////////////////////
// JOB REQUEST SCHEMA
/////////////////////////////////////////

export const JobRequestSchema = z.object({
  id: z.string(),
  jobType: z.string(),
  category: z.string(),
  name: z.string(),
  requestId: z.string(),
})

export type JobRequest = z.infer<typeof JobRequestSchema>

export default JobRequestSchema;
