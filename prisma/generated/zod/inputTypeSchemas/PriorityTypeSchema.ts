import { z } from 'zod';

export const PriorityTypeSchema = z.enum(['NO_PRIORITY','LOW','MEDIUM','HIGH','URGENT']);

export type PriorityTypeType = `${z.infer<typeof PriorityTypeSchema>}`

export default PriorityTypeSchema;
