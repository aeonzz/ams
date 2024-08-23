import { z } from "zod";
import { PriorityTypeSchema, RequestStatusTypeSchema, RequestTypeSchema } from "prisma/generated/zod";

export const requestSchemaBase = z.object({
  notes: z.string(),
  priority: PriorityTypeSchema,
  dueDate: z.date(),
  type: RequestTypeSchema,
  department: z.string(),
});

export const jobRequestSchema = requestSchemaBase.extend({
  jobType: z.string().optional(),
  name: z.string(),
  category: z.string(),
  files: z.array(z.string()).optional(),
});

export type JobRequestSchema = z.infer<typeof jobRequestSchema>;

export const extendedJobRequestSchema = jobRequestSchema.extend({
  path: z.string(),
});

export type ExtendedJobRequestSchema = z.infer<typeof extendedJobRequestSchema>;

// export const RequestSchema = z.object({
//   notes: z.string(),
//   priority: PriorityTypeSchema,
//   dueDate: z.date(),
//   type: RequestTypeSchema,
//   department: z.string(),
//   jobType: z.string().optional(),
//   name: z.string(),
//   category: z.string(),
//   files: z.array(z.string()).optional(),
//   path: z.string(),
// });

// export type RequestSchemaType = z.infer<typeof RequestSchema>;

export const updateRequestSchemaBase = z.object({
  notes: z.string().optional(),
  priority: PriorityTypeSchema.optional(),
  dueDate: z.date().optional(),
  type: RequestTypeSchema.optional(),
  status: RequestStatusTypeSchema.optional(),
  department: z.string().optional(),
});

export const updateJobRequestSchema = updateRequestSchemaBase.extend({
  jobType: z.string().optional(),
  name: z.string().optional(),
  category: z.string().optional(),
  files: z.array(z.string()).optional(),
});

export type UpdateJobRequestSchema = z.infer<typeof updateJobRequestSchema>;

export const extendedUpdateJobRequestSchema = updateJobRequestSchema.extend({
  path: z.string(),
  id: z.string(),
});

export type ExtendedUpdateJobRequestSchema = z.infer<typeof extendedUpdateJobRequestSchema>
