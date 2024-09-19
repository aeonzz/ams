import { z } from 'zod';
import type { SessionWithRelations } from './SessionSchema'
import type { SettingWithRelations } from './SettingSchema'
import type { RequestWithRelations } from './RequestSchema'
import type { UserRoleWithRelations } from './UserRoleSchema'
import type { JobRequestWithRelations } from './JobRequestSchema'
import type { VenueRequestWithRelations } from './VenueRequestSchema'
import type { GenericAuditLogWithRelations } from './GenericAuditLogSchema'
import type { UserDepartmentWithRelations } from './UserDepartmentSchema'
import { SessionWithRelationsSchema } from './SessionSchema'
import { SettingWithRelationsSchema } from './SettingSchema'
import { RequestWithRelationsSchema } from './RequestSchema'
import { UserRoleWithRelationsSchema } from './UserRoleSchema'
import { JobRequestWithRelationsSchema } from './JobRequestSchema'
import { VenueRequestWithRelationsSchema } from './VenueRequestSchema'
import { GenericAuditLogWithRelationsSchema } from './GenericAuditLogSchema'
import { UserDepartmentWithRelationsSchema } from './UserDepartmentSchema'

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
  venueRequest: VenueRequestWithRelations[];
  genericAuditLog: GenericAuditLogWithRelations[];
  userDepartments: UserDepartmentWithRelations[];
};

export type UserWithRelations = z.infer<typeof UserSchema> & UserRelations

export const UserWithRelationsSchema: z.ZodType<UserWithRelations> = UserSchema.merge(z.object({
  sessions: z.lazy(() => SessionWithRelationsSchema).array(),
  setting: z.lazy(() => SettingWithRelationsSchema).nullable(),
  requestAsUser: z.lazy(() => RequestWithRelationsSchema).array(),
  requestAsReviewer: z.lazy(() => RequestWithRelationsSchema).array(),
  userRole: z.lazy(() => UserRoleWithRelationsSchema).array(),
  jobRequestsAsAssigned: z.lazy(() => JobRequestWithRelationsSchema).array(),
  venueRequest: z.lazy(() => VenueRequestWithRelationsSchema).array(),
  genericAuditLog: z.lazy(() => GenericAuditLogWithRelationsSchema).array(),
  userDepartments: z.lazy(() => UserDepartmentWithRelationsSchema).array(),
}))

export default UserSchema;
