import { z } from 'zod';

export const RequestTypeSchema = z.enum(['JOB','RESOURCE','VENUE','TRANSPORT']);

export type RequestTypeType = `${z.infer<typeof RequestTypeSchema>}`

export default RequestTypeSchema;
