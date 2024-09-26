import { z } from "zod";
import {
  PriorityTypeSchema,
  RequestStatusTypeSchema,
  RequestTypeSchema,
} from "prisma/generated/zod";

export const requestSchemaBase = z.object({
  priority: PriorityTypeSchema,
  type: RequestTypeSchema,
  departmentId: z.string(),
});

export const jobRequestSchemaServer = z.object({
  notes: z
    .string()
    .min(10, { message: "Must be at least 10 characters long" })
    .max(600, { message: "Cannot be more than 600 characters long" }),
  images: z.array(z.string()).optional(),
  jobType: z.string(),
  dueDate: z.date(),
});

export const jobRequestSchemaWithPath = jobRequestSchemaServer.extend({
  path: z.string(),
});

export type JobRequestSchemaWithPath = z.infer<typeof jobRequestSchemaWithPath>;

export const extendedJobRequestSchema = requestSchemaBase.merge(
  jobRequestSchemaWithPath
);

export type ExtendedJobRequestSchema = z.infer<typeof extendedJobRequestSchema>;

export const venueRequestSchemaBase = z.object({
  venueId: z.string({
    required_error: "Please select a venue",
  }),
  purpose: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
  otherPurpose: z.string().optional(),
  startTime: z
    .date({
      required_error: "Start time is required",
    })
    .min(new Date(), {
      message: "Date needed must be in the future",
    })
    .refine((date) => date.getHours() !== 0 || date.getMinutes() !== 0, {
      message: "Time cannot be exactly midnight (00:00)",
    }),
  endTime: z
    .date({
      required_error: "End time is required",
    })
    .min(new Date(), {
      message: "Date needed must be in the future",
    })
    .refine((date) => date.getHours() !== 0 || date.getMinutes() !== 0, {
      message: "Time cannot be exactly midnight (00:00)",
    }),
  setupRequirements: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one item.",
    }),
  notes: z.string().optional(),
});

export const venueRequestSchema = venueRequestSchemaBase.refine(
  (data) => data.startTime <= data.endTime,
  {
    message:
      "Date and time needed must not be later than the end date and time",
    path: ["startTime"],
  }
);

export type VenueRequestSchema = z.infer<typeof venueRequestSchema>;

export const venueRequestSchemaWithPath = venueRequestSchemaBase.extend({
  path: z.string(),
});

export type VenueRequestSchemaWithPath = z.infer<
  typeof venueRequestSchemaWithPath
>;

export const extendedVenueRequestSchema = requestSchemaBase.merge(
  venueRequestSchemaWithPath
);

export type ExtendedVenueRequestSchema = z.infer<
  typeof extendedVenueRequestSchema
>;

export const transportRequestSchema = z.object({
  vehicleId: z.string({
    required_error: "Please select a vehicle",
  }),
  description: z.string().min(1, "Description is required"),
  destination: z.string().min(1, "Please add a destination"),
  dateAndTimeNeeded: z
    .date({
      required_error: "Date time is required",
    })
    .min(new Date(), {
      message: "Date needed must be in the future",
    })
    .refine((date) => date.getHours() !== 0 || date.getMinutes() !== 0, {
      message: "Time cannot be exactly midnight (00:00)",
    }),
});

export type TransportRequestSchema = z.infer<typeof transportRequestSchema>;

export const transportRequestSchemaWithPath = transportRequestSchema.extend({
  path: z.string(),
});

export type TransportRequestSchemaWithPath = z.infer<
  typeof transportRequestSchemaWithPath
>;

export const extendedTransportRequestSchema = requestSchemaBase.merge(
  transportRequestSchemaWithPath
);

export type ExtendedTransportRequestSchema = z.infer<
  typeof extendedTransportRequestSchema
>;

export const updateRequestSchemaBase = z.object({
  notes: z.string().optional(),
  priority: PriorityTypeSchema.optional(),
  dueDate: z.date().optional(),
  type: RequestTypeSchema.optional(),
  status: RequestStatusTypeSchema.optional(),
  departmentId: z.string().optional(),
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
