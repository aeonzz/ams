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
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

export default UserSchema;
