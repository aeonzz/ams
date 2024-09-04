import { z } from 'zod';
import type { UserWithRelations } from './UserSchema'
import type { RoleWithRelations } from './RoleSchema'
import type { DepartmentWithRelations } from './DepartmentSchema'
import { UserWithRelationsSchema } from './UserSchema'
import { RoleWithRelationsSchema } from './RoleSchema'
import { DepartmentWithRelationsSchema } from './DepartmentSchema'

/////////////////////////////////////////
// USER ROLE SCHEMA
/////////////////////////////////////////

export const UserRoleSchema = z.object({
  id: z.string(),
  userId: z.string(),
  roleId: z.string(),
  departmentId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type UserRole = z.infer<typeof UserRoleSchema>

/////////////////////////////////////////
// USER ROLE RELATION SCHEMA
/////////////////////////////////////////

export type UserRoleRelations = {
  user: UserWithRelations;
  role: RoleWithRelations;
  department: DepartmentWithRelations;
};

export type UserRoleWithRelations = z.infer<typeof UserRoleSchema> & UserRoleRelations

export const UserRoleWithRelationsSchema: z.ZodType<UserRoleWithRelations> = UserRoleSchema.merge(z.object({
  user: z.lazy(() => UserWithRelationsSchema),
  role: z.lazy(() => RoleWithRelationsSchema),
  department: z.lazy(() => DepartmentWithRelationsSchema),
}))

export default UserRoleSchema;
