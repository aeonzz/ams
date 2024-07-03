import { z } from 'zod';

export const RoleSchema = z.enum(['USER','ADMIN','SYSTEMADMIN']);

export type RoleType = `${z.infer<typeof RoleSchema>}`

export default RoleSchema;
