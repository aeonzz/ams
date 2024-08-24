import { z } from "zod";
import {
  PriorityTypeSchema,
  RequestStatusTypeSchema,
  RequestTypeSchema,
} from "prisma/generated/zod";

export const requestSchemaBase = z.object({
  priority: PriorityTypeSchema,
  type: RequestTypeSchema,
  department: z.string(),
});

export const jobRequestSchema = requestSchemaBase.extend({
  notes: z.string(),
  jobType: z.string().optional(),
  name: z.string(),
  dueDate: z.date(),
  category: z.string(),
  files: z.array(z.string()).optional(),
});

export type JobRequestSchema = z.infer<typeof jobRequestSchema>;

export const extendedJobRequestSchema = jobRequestSchema.extend({
  path: z.string(),
});

export type ExtendedJobRequestSchema = z.infer<typeof extendedJobRequestSchema>;

export const venueRequestSchema = requestSchemaBase.extend({
  venueName: z.string({
    required_error: "Please select a venue",
  }),
  purpose: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
  startTime: z.date({
    required_error: "Start time is required",
  }),
  endTime: z.date({
    required_error: "Start time is required",
  }),
  setupRequirements: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one item.",
    }),
});

export type VenueRequestSchema = z.infer<typeof venueRequestSchema>;

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

export type ExtendedUpdateJobRequestSchema = z.infer<
  typeof extendedUpdateJobRequestSchema
>;
