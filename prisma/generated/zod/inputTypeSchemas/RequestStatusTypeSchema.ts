import { z } from 'zod';

export const RequestStatusTypeSchema = z.enum(['PENDING','APPROVED','REVIEWED','COMPLETED','REJECTED','CANCELLED','ON_HOLD']);

export type RequestStatusTypeType = `${z.infer<typeof RequestStatusTypeSchema>}`

export default RequestStatusTypeSchema;
