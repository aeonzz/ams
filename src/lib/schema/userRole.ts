import { z } from "zod";

export const createUserRoleSchema = z.object({
  userId: z.string({
    required_error: "User is required",
  }),
  roleId: z.string({
    required_error: "Role is required",
  }),
  departmentId: z.string({
    required_error: "Department is required",
  }),
});

export type CreateUserRoleSchema = z.infer<typeof createUserRoleSchema>;

export const createUserRoleSchemaWithPath = createUserRoleSchema.extend({
  path: z.string(),
});

export type CreateUserRoleSchemaWithPath = z.infer<
  typeof createUserRoleSchemaWithPath
>;
