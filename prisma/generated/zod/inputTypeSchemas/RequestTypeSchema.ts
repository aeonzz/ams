import { z } from 'zod';

export const RequestTypeSchema = z.enum(['JOB','BORROW','SUPPLY','VENUE','TRANSPORT']);

export type RequestTypeType = `${z.infer<typeof RequestTypeSchema>}`

export default RequestTypeSchema;
