import { z } from 'zod';
import type { SessionWithRelations } from './SessionSchema'
import type { SettingWithRelations } from './SettingSchema'
import type { RequestWithRelations } from './RequestSchema'
import type { UserRoleWithRelations } from './UserRoleSchema'
import type { JobRequestWithRelations } from './JobRequestSchema'
import { SessionWithRelationsSchema } from './SessionSchema'
import { SettingWithRelationsSchema } from './SettingSchema'
import { RequestWithRelationsSchema } from './RequestSchema'
import { UserRoleWithRelationsSchema } from './UserRoleSchema'
import { JobRequestWithRelationsSchema } from './JobRequestSchema'

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
  username: z.string(),
  department: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// USER RELATION SCHEMA
/////////////////////////////////////////

export type UserRelations = {
  sessions: SessionWithRelations[];
  setting?: SettingWithRelations | null;
  request: RequestWithRelations[];
  userRole: UserRoleWithRelations[];
  jobRequestsAsReviewer: JobRequestWithRelations[];
  jobRequestsAsAssigned: JobRequestWithRelations[];
};

export type UserWithRelations = z.infer<typeof UserSchema> & UserRelations

export const UserWithRelationsSchema: z.ZodType<UserWithRelations> = UserSchema.merge(z.object({
  sessions: z.lazy(() => SessionWithRelationsSchema).array(),
  setting: z.lazy(() => SettingWithRelationsSchema).nullable(),
  request: z.lazy(() => RequestWithRelationsSchema).array(),
  userRole: z.lazy(() => UserRoleWithRelationsSchema).array(),
  jobRequestsAsReviewer: z.lazy(() => JobRequestWithRelationsSchema).array(),
  jobRequestsAsAssigned: z.lazy(() => JobRequestWithRelationsSchema).array(),
}))

export default UserSchema;
