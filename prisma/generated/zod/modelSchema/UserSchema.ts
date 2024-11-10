import { z } from 'zod';
import type { SessionWithRelations } from './SessionSchema'
import type { SettingWithRelations } from './SettingSchema'
import type { RequestWithRelations } from './RequestSchema'
import type { UserRoleWithRelations } from './UserRoleSchema'
import type { JobRequestWithRelations } from './JobRequestSchema'
import type { UserDepartmentWithRelations } from './UserDepartmentSchema'
import type { NotificationWithRelations } from './NotificationSchema'
import { SessionWithRelationsSchema } from './SessionSchema'
import { SettingWithRelationsSchema } from './SettingSchema'
import { RequestWithRelationsSchema } from './RequestSchema'
import { UserRoleWithRelationsSchema } from './UserRoleSchema'
import { JobRequestWithRelationsSchema } from './JobRequestSchema'
import { UserDepartmentWithRelationsSchema } from './UserDepartmentSchema'
import { NotificationWithRelationsSchema } from './NotificationSchema'

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  profileUrl: z.string().nullable(),
  hashedPassword: z.string(),
  resetPasswordToken: z.string().nullable(),
  resetPasswordTokenExpiry: z.coerce.date().nullable(),
  firstName: z.string(),
  middleName: z.string().nullable(),
  lastName: z.string(),
  isArchived: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  isAdmin: z.boolean(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// USER RELATION SCHEMA
/////////////////////////////////////////

export type UserRelations = {
  sessions: SessionWithRelations[];
  setting?: SettingWithRelations | null;
  requestAsUser: RequestWithRelations[];
  requestAsReviewer: RequestWithRelations[];
  userRole: UserRoleWithRelations[];
  jobRequestsAsAssigned: JobRequestWithRelations[];
  userDepartments: UserDepartmentWithRelations[];
  notification: NotificationWithRelations[];
};

export type UserWithRelations = z.infer<typeof UserSchema> & UserRelations

export const UserWithRelationsSchema: z.ZodType<UserWithRelations> = UserSchema.merge(z.object({
  sessions: z.lazy(() => SessionWithRelationsSchema).array(),
  setting: z.lazy(() => SettingWithRelationsSchema).nullable(),
  requestAsUser: z.lazy(() => RequestWithRelationsSchema).array(),
  requestAsReviewer: z.lazy(() => RequestWithRelationsSchema).array(),
  userRole: z.lazy(() => UserRoleWithRelationsSchema).array(),
  jobRequestsAsAssigned: z.lazy(() => JobRequestWithRelationsSchema).array(),
  userDepartments: z.lazy(() => UserDepartmentWithRelationsSchema).array(),
  notification: z.lazy(() => NotificationWithRelationsSchema).array(),
}))

export default UserSchema;
