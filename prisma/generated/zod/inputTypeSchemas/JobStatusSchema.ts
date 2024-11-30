import { z } from 'zod';

export const JobStatusSchema = z.enum(['PENDING','IN_PROGRESS','COMPLETED']);

export type JobStatusType = `${z.infer<typeof JobStatusSchema>}`

export default JobStatusSchema;
