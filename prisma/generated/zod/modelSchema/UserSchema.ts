import { z } from 'zod';
import { RoleTypeSchema } from '../inputTypeSchemas/RoleTypeSchema'
import type { SessionWithRelations } from './SessionSchema'
import type { SettingWithRelations } from './SettingSchema'
import type { RequestWithRelations } from './RequestSchema'
import { SessionWithRelationsSchema } from './SessionSchema'
import { SettingWithRelationsSchema } from './SettingSchema'
import { RequestWithRelationsSchema } from './RequestSchema'

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  role: RoleTypeSchema,
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
};

export type UserWithRelations = z.infer<typeof UserSchema> & UserRelations

export const UserWithRelationsSchema: z.ZodType<UserWithRelations> = UserSchema.merge(z.object({
  sessions: z.lazy(() => SessionWithRelationsSchema).array(),
  setting: z.lazy(() => SettingWithRelationsSchema).nullable(),
  request: z.lazy(() => RequestWithRelationsSchema).array(),
}))

export default UserSchema;
