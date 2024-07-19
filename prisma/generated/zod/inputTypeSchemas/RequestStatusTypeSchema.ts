import { z } from 'zod';

export const RequestStatusTypeSchema = z.enum(['PENDING','APPROVED','IN_PROGRESS','COMPLETED','REJECTED','CANCELLED','ON_HOLD','DELAYED','UNDER_REVIEW','SCHEDULED']);

export type RequestStatusTypeType = `${z.infer<typeof RequestStatusTypeSchema>}`

export default RequestStatusTypeSchema;
