import { z } from "zod";

export const jobRequestSchema = z.object({
  notes: z
    .string()
    .min(10, { message: "Must be at least 10 characters long" })
    .max(600, { message: "Cannot be more than 600 characters long" }),
  images: z.array(z.instanceof(File)).optional(),
  jobtype: z.string({
    required_error: "Please select a job type.",
  }),
  priority: z.string({
    required_error: "Please select a job priority.",
  }),
  dueDate: z.date({
    required_error: "Due date is required.",
  }),
});

export type JobRequestSchema = z.infer<typeof jobRequestSchema>;
