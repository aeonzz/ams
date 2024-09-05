import { z } from 'zod';
import type { UserRoleWithRelations } from './UserRoleSchema'
import { UserRoleWithRelationsSchema } from './UserRoleSchema'

/////////////////////////////////////////
// ROLE SCHEMA
/////////////////////////////////////////

export const RoleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  isArchived: z.boolean(),
})

export type Role = z.infer<typeof RoleSchema>

/////////////////////////////////////////
// ROLE RELATION SCHEMA
/////////////////////////////////////////

export type RoleRelations = {
  userRoles: UserRoleWithRelations[];
};

export type RoleWithRelations = z.infer<typeof RoleSchema> & RoleRelations

export const RoleWithRelationsSchema: z.ZodType<RoleWithRelations> = RoleSchema.merge(z.object({
  userRoles: z.lazy(() => UserRoleWithRelationsSchema).array(),
}))

export default RoleSchema;
