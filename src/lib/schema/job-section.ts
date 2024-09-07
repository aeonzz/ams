import path from "path";
import { z } from "zod";

export const createJobSectionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export type CreateJobSectionSchema = z.infer<typeof createJobSectionSchema>;

export const createJobSectionSchemaWithPath = createJobSectionSchema.extend({
  path: z.string(),
});

export type CreateJobSectionSchemaWithPath = z.infer<
  typeof createJobSectionSchemaWithPath
>;

export const updateJobSectionSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});

export type UpdateJobSectionSchema = z.infer<typeof updateJobSectionSchema>;

export const updateJobSectionSchemaWithPath = updateJobSectionSchema.extend({
  id: z.string(),
  path: z.string(),
});

export type UpdateJobSectionSchemaWithPath = z.infer<
  typeof updateJobSectionSchemaWithPath
>;

export const deleteJobSectionsSchema = z.object({
  ids: z.string().array(),
  path: z.string(),
});

export type DeleteJobSectionsSchema = z.infer<typeof deleteJobSectionsSchema>;
