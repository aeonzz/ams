import { z } from "zod";

import { RoleSchema } from "../inputTypeSchemas/RoleSchema";

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  role: RoleSchema,
  id: z.string(),
  email: z.string(),
  hashedPassword: z.string(),
  resetPasswordToken: z.string().nullable(),
  resetPasswordTokenExpiry: z.coerce.date().nullable(),
  name: z.string().nullable(),
});

export type User = z.infer<typeof UserSchema>;

export default UserSchema;
