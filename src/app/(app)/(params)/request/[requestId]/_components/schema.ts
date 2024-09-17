import {
  ChangeTypeSchema,
  EntityTypeSchema,
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
  changeType: ChangeTypeSchema,
  entityType: EntityTypeSchema,
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
