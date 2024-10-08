import { z } from 'zod';

export const JobStatusSchema = z.enum(['PENDING','IN_PROGRESS','COMPLETED','ON_HOLD','CANCELLED','REJECTED','REWORK_IN_PROGRESS','VERIFIED']);

export type JobStatusType = `${z.infer<typeof JobStatusSchema>}`

export default JobStatusSchema;
