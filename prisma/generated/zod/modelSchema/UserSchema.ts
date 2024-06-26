import { z } from 'zod';

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  hashedPassword: z.string(),
  name: z.string().nullable(),
})

export type User = z.infer<typeof UserSchema>

export default UserSchema;
