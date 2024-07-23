import { z } from 'zod';

export const PriorityTypeSchema = z.enum(['NOPRIORITY','LOW','MEDIUM','HIGH','URGENT']);

export type PriorityTypeType = `${z.infer<typeof PriorityTypeSchema>}`

export default PriorityTypeSchema;
