import { z } from 'zod';

export const RoleTypeSchema = z.enum(['USER','REQUEST_MANAGER','ADMIN']);

export type RoleTypeType = `${z.infer<typeof RoleTypeSchema>}`

export default RoleTypeSchema;
