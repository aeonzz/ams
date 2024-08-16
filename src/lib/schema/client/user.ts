import { RoleTypeSchema } from "prisma/generated/zod";
import { z } from "zod";

export const createUserSchemaBase = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  department: z.string().min(1, "Department is required"),
  username: z.string().min(1, "Username is required"),
  role: RoleTypeSchema,
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

export const updateUserSchemaBase = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email")
    .optional(),
  department: z.string().min(1, "Department is required").optional(),
  username: z.string().min(1, "Username is required").optional(),
  role: RoleTypeSchema.optional(),
  password: z
    .string()
    .min(4, { message: "Must be at least 4 characters long" })
    .max(15, { message: "Cannot be more than 15 characters long" })
    .optional(),
  confirmPassword: z
    .string()
    .min(1, "Password confirmation is required")
    .optional(),
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
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type ExtendedUserInputSchema = z.infer<typeof extendedUserInputSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
export type ExtendedUpdateUserSchema = z.infer<typeof extendedUserInputSchema>;
