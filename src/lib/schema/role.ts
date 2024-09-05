import { z } from "zod";

export const roleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export type RoleSchema = z.infer<typeof roleSchema>;

export const roleSchemaWithPath = roleSchema.extend({
  path: z.string(),
});

export type RoleSchemaWithPath = z.infer<typeof roleSchemaWithPath>;

export const assignRoleSchema = z.object({
  users: z.array(
    z.object({
      id: z.string(),
      departmentId: z.string(),
    })
  ),
  roleId: z.string(),
  path: z.string(),
});

export type AssignRoleSchema = z.infer<typeof assignRoleSchema>;

export const updateRoleSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional().nullable(),
});

export type UpdateRoleSchema = z.infer<typeof updateRoleSchema>;

export const updateRoleSchemaWithPath = updateRoleSchema.extend({
  id: z.string(),
  path: z.string(),
});

export type UpdateRoleSchemaWithPath = z.infer<typeof updateRoleSchemaWithPath>;

export const deleteRolesSchema = z.object({
  ids: z.string().array(),
  path: z.string(),
});

export type DeleteRolesSchema = z.infer<typeof deleteRolesSchema>;
