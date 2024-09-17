import { z } from 'zod';
import type { DepartmentWithRelations } from './DepartmentSchema'
import type { SectionWithRelations } from './SectionSchema'
import type { SessionWithRelations } from './SessionSchema'
import type { SettingWithRelations } from './SettingSchema'
import type { RequestWithRelations } from './RequestSchema'
import type { UserRoleWithRelations } from './UserRoleSchema'
import type { JobRequestWithRelations } from './JobRequestSchema'
import type { VenueRequestWithRelations } from './VenueRequestSchema'
import type { GenericAuditLogWithRelations } from './GenericAuditLogSchema'
import { DepartmentWithRelationsSchema } from './DepartmentSchema'
import { SectionWithRelationsSchema } from './SectionSchema'
import { SessionWithRelationsSchema } from './SessionSchema'
import { SettingWithRelationsSchema } from './SettingSchema'
import { RequestWithRelationsSchema } from './RequestSchema'
import { UserRoleWithRelationsSchema } from './UserRoleSchema'
import { JobRequestWithRelationsSchema } from './JobRequestSchema'
import { VenueRequestWithRelationsSchema } from './VenueRequestSchema'
import { GenericAuditLogWithRelationsSchema } from './GenericAuditLogSchema'

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
  departmentId: z.string().nullable(),
  createdAt: z.coerce.date(),
  sectionId: z.string().nullable(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// USER RELATION SCHEMA
/////////////////////////////////////////

export type UserRelations = {
  department?: DepartmentWithRelations | null;
  section?: SectionWithRelations | null;
  sessions: SessionWithRelations[];
  setting?: SettingWithRelations | null;
  requestAsUser: RequestWithRelations[];
  requestAsReviewer: RequestWithRelations[];
  userRole: UserRoleWithRelations[];
  jobRequestsAsAssigned: JobRequestWithRelations[];
  venueRequest: VenueRequestWithRelations[];
  genericAuditLog: GenericAuditLogWithRelations[];
};

export type UserWithRelations = z.infer<typeof UserSchema> & UserRelations

export const UserWithRelationsSchema: z.ZodType<UserWithRelations> = UserSchema.merge(z.object({
  department: z.lazy(() => DepartmentWithRelationsSchema).nullable(),
  section: z.lazy(() => SectionWithRelationsSchema).nullable(),
  sessions: z.lazy(() => SessionWithRelationsSchema).array(),
  setting: z.lazy(() => SettingWithRelationsSchema).nullable(),
  requestAsUser: z.lazy(() => RequestWithRelationsSchema).array(),
  requestAsReviewer: z.lazy(() => RequestWithRelationsSchema).array(),
  userRole: z.lazy(() => UserRoleWithRelationsSchema).array(),
  jobRequestsAsAssigned: z.lazy(() => JobRequestWithRelationsSchema).array(),
  venueRequest: z.lazy(() => VenueRequestWithRelationsSchema).array(),
  genericAuditLog: z.lazy(() => GenericAuditLogWithRelationsSchema).array(),
}))

export default UserSchema;
