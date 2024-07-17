import { z } from 'zod';

export const PriorityTypeSchema = z.enum(['LOW','MEDIUM','HIGH']);

export type PriorityTypeType = `${z.infer<typeof PriorityTypeSchema>}`

export default PriorityTypeSchema;
