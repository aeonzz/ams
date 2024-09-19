import { z } from "zod";

export const createUserSchemaBase = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "last name is required"),
  departmentIds: z
    .array(z.string(), {
      required_error: "Department is required",
    })
    .min(1, "At least one department is required"),
  password: z
    .string()
    .min(4, { message: "Must be at least 4 characters long" })
    .max(15, { message: "Cannot be more than 15 characters long" }),
  confirmPassword: z.string().min(1, "Password confirmation is required"),
});

export const createUserSchema = createUserSchemaBase.refine(
  (data) => data.password === data.confirmPassword,
  {
    path: ["confirmPassword"],
    message: "Password do not match",
  }
);

export const extendedUserInputSchema = createUserSchemaBase.extend({
  path: z.string(),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type ExtendedUserInputSchema = z.infer<typeof extendedUserInputSchema>;

export const updateUserSchemaBase = z.object({
  email: z.string().email("Invalid email").optional(),
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  profileUrl: z.string().optional(),
  password: z
    .string()
    .max(15, { message: "Cannot be more than 15 characters long" })
    .optional(),
  confirmPassword: z.string().optional(),
});

export const updateUserSchema = updateUserSchemaBase.refine(
  (data) => data.password === data.confirmPassword,
  {
    path: ["confirmPassword"],
    message: "Password do not match",
  }
);

export const extendedUpdateUserSchema = updateUserSchemaBase.extend({
  path: z.string(),
  id: z.string().optional(),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;

export const deleteUsersSchema = z.object({
  ids: z.string().array(),
  path: z.string(),
});

export type DeleteUsersSchema = z.infer<typeof deleteUsersSchema>;

export const updateUsersSchema = z.object({
  ids: z.string().array(),
  path: z.string(),
});

export type UpdateUsersSchema = z.infer<typeof updateUsersSchema>;

export const createUserRoles = z.object({
  userId: z.string(),
  roleId: z.array(z.string()),
  departmentId: z.string(),
});

export type CreateUserRoles = z.infer<typeof createUserRoles>;

export const createUserRolesWithPath = createUserRoles.extend({
  path: z.string(),
});

export type CreateUserRolesWithPath = z.infer<typeof createUserRolesWithPath>;
