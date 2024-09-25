import { DepartmentTypeSchema } from "prisma/generated/zod";
import { z } from "zod";

export const createDepartmentSchema = z.object({
  name: z
    .string()
    .min(1, "name is required")
    .max(30, "Cannot be more than 15 characters long"),
  description: z.string().optional(),
  acceptsJobs: z.boolean().default(false).optional(),
  acceptsTransport: z.boolean().default(false).optional(),
  responsibilities: z.string().optional(),
  departmentType: DepartmentTypeSchema,
});

export type CreateDepartmentSchema = z.infer<typeof createDepartmentSchema>;

export const extendedCreateDepartmentSchema = createDepartmentSchema.extend({
  path: z.string(),
});

export const updateDepartmentSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  acceptsJobs: z.boolean().optional(),
  acceptsTransport: z.boolean().optional(),
  responsibilities: z.string().optional(),
  departmentType: DepartmentTypeSchema.optional(),
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
