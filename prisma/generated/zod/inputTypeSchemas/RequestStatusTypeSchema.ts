import { z } from 'zod';

export const RequestStatusTypeSchema = z.enum(['PENDING','APPROVED','IN_PROGRESS','UNDER_REVIEW','REVIEWED','COMPLETED','REJECTED','CANCELLED']);

export type RequestStatusTypeType = `${z.infer<typeof RequestStatusTypeSchema>}`

export default RequestStatusTypeSchema;
