import { z } from "zod";

export const createDepartmentSchema = z.object({
  name: z
    .string()
    .min(1, "name is required")
    .max(30, "Cannot be more than 15 characters long"),
  label: z
    .string()
    .min(1, "label is required")
    .max(10, "Cannot be more than 10 characters"),
});

export type CreateDepartmentSchema = z.infer<typeof createDepartmentSchema>;

export const extendedCreateDepartmentSchema = createDepartmentSchema.extend({
  path: z.string(),
});

export const updateDepartmentSchema = z.object({
  name: z.string().optional(),
  label: z.string().optional(),
});

export type UpdateDepartmentSchema = z.infer<typeof updateDepartmentSchema>;

export const extendedUpdateDepartmentSchema = updateDepartmentSchema.extend({
  path: z.string(),
  id: z.string().optional(),
});

export const deleteDepartmentsSchema = z.object({
  ids: z.string().array(),
  path: z.string(),
});

export type DeleteDepartmentsSchema = z.infer<typeof deleteDepartmentsSchema>;
