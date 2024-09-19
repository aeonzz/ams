import { z } from 'zod';
import type { UserWithRelations } from './UserSchema'
import type { DepartmentWithRelations } from './DepartmentSchema'
import { UserWithRelationsSchema } from './UserSchema'
import { DepartmentWithRelationsSchema } from './DepartmentSchema'

/////////////////////////////////////////
// USER DEPARTMENT SCHEMA
/////////////////////////////////////////

export const UserDepartmentSchema = z.object({
  id: z.string(),
  userId: z.string(),
  departmentId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type UserDepartment = z.infer<typeof UserDepartmentSchema>

/////////////////////////////////////////
// USER DEPARTMENT RELATION SCHEMA
/////////////////////////////////////////

export type UserDepartmentRelations = {
  user: UserWithRelations;
  department: DepartmentWithRelations;
};

export type UserDepartmentWithRelations = z.infer<typeof UserDepartmentSchema> & UserDepartmentRelations

export const UserDepartmentWithRelationsSchema: z.ZodType<UserDepartmentWithRelations> = UserDepartmentSchema.merge(z.object({
  user: z.lazy(() => UserWithRelationsSchema),
  department: z.lazy(() => DepartmentWithRelationsSchema),
}))

export default UserDepartmentSchema;
