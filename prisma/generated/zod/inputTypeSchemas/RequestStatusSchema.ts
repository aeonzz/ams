import { z } from 'zod';

export const RequestStatusSchema = z.enum(['PENDING','APPROVED','REJECTED','FULFILLED','RETURNED','PARTIALLY_FULFILLED']);

export type RequestStatusType = `${z.infer<typeof RequestStatusSchema>}`

export default RequestStatusSchema;
