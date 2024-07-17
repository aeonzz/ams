import { z } from 'zod';

export const RoleTypeSchema = z.enum(['USER','ADMIN','SYSTEMADMIN']);

export type RoleTypeType = `${z.infer<typeof RoleTypeSchema>}`

export default RoleTypeSchema;
