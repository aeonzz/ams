import { z } from 'zod';

export const ChangeTypeSchema = z.enum(['STATUS_CHANGE','FIELD_UPDATE','ASSIGNMENT_CHANGE','REVIEWER_CHANGE','APPROVER_CHANGE','APPROVED','CANCELLED','CREATED','VENUE_CHANGE','TIME_UPDATE','OTHER']);

export type ChangeTypeType = `${z.infer<typeof ChangeTypeSchema>}`

export default ChangeTypeSchema;
