import { z } from 'zod';
import { RoleTypeSchema } from '../inputTypeSchemas/RoleTypeSchema'

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
})

export type User = z.infer<typeof UserSchema>

export default UserSchema;
