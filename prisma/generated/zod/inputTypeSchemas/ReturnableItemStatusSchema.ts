import { z } from 'zod';

export const ReturnableItemStatusSchema = z.enum(['AVAILABLE','IN_USE','MAINTENANCE','LOST','RETURNED','PENDING_RETURN']);

export type ReturnableItemStatusType = `${z.infer<typeof ReturnableItemStatusSchema>}`

export default ReturnableItemStatusSchema;
