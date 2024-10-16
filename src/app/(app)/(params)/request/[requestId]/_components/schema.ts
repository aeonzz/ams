import {
  ChangeTypeSchema,
  EntityTypeSchema,
  JobStatusSchema,
  JobTypeSchema,
  RequestStatusTypeSchema,
} from "prisma/generated/zod";
import { z } from "zod";

export const assignPersonnelSchema = z.object({
  requestId: z.string(),
  personnelId: z.string(),
});

export type AssignPersonnelSchema = z.infer<typeof assignPersonnelSchema>;

export const assignPersonnelSchemaWithPath = assignPersonnelSchema.extend({
  path: z.string(),
});

export type AssignPersonnelSchemaWithPath = z.infer<
  typeof assignPersonnelSchemaWithPath
>;

export const updateRequestStatusSchema = z.object({
  requestId: z.string(),
  reviewerId: z.string().optional(),
  status: RequestStatusTypeSchema,
  cancellationReason: z.string().optional(),
});

export type UpdateRequestStatusSchema = z.infer<
  typeof updateRequestStatusSchema
>;

export const updateRequestStatusSchemaWithPath =
  updateRequestStatusSchema.extend({
    path: z.string(),
  });

export type UpdateRequestStatusSchemaWithPath = z.infer<
  typeof updateRequestStatusSchemaWithPath
>;

export const updateJobRequestSchema = z.object({
  description: z.string().optional(),
  dueDate: z.date().optional(),
  estimatedTime: z.number().optional(),
  status: JobStatusSchema.optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  jobType: JobTypeSchema.optional(),
  progressNotes: z.string().optional(),
});

export type UpdateJobRequestSchema = z.infer<typeof updateJobRequestSchema>;

export const updateJobRequestSchemaWithPath = updateJobRequestSchema.extend({
  path: z.string(),
  requestId: z.string(),
});

export const reworkJobRequestSchema = z.object({
  id: z.string(),
  rejectionReason: z.string(),
  status: JobStatusSchema,
});

export type ReworkJobRequestSchema = z.infer<typeof reworkJobRequestSchema>;

export const updateReworkJobRequestSchema = z.object({
  reworkId: z.string(),
  reworkStartDate: z.date().optional(),
  reworkEndDate: z.date().optional(),
  status: JobStatusSchema,
});

export type UpdateReworkJobRequestSchema = z.infer<
  typeof updateReworkJobRequestSchema
>;

export const cancelOwnRequestSchema = z.object({
  requestId: z.string(),
  path: z.string(),
  status: RequestStatusTypeSchema
});

export type CancelOwnRequestSchema = z.infer<typeof cancelOwnRequestSchema>;
