import { z } from "zod";

export const createUserRoleSchema = z.object({
  userIds: z
    .array(z.string(), {
      required_error: "User is required",
    })
    .min(1, "At least one user is required"),
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

export const createSingleUserRoleSchema = z.object({
  userId: z.string({
    required_error: "User is required",
  }),
  departmentId: z.string({
    required_error: "Department is required",
  }),
  roleIds: z
    .array(z.string(), {
      required_error: "User is required",
    })
    .min(1, "At least one user is required"),
});

export type CreateSingleUserRoleSchema = z.infer<
  typeof createSingleUserRoleSchema
>;

export const createSingleUserRoleSchemaWithPath =
  createSingleUserRoleSchema.extend({
    path: z.string(),
  });

export type CreateSingleUserRoleSchemaWithPath = z.infer<
  typeof createSingleUserRoleSchemaWithPath
>;
