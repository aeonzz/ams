import { JobTypeSchema } from "prisma/generated/zod";
import { z } from "zod";

export const createjobRequestSchema = z.object({
  description: z
    .string()
    .min(10, { message: "Must be at least 10 characters long" })
    .max(600, { message: "Cannot be more than 600 characters long" }),
  jobtype: JobTypeSchema.refine((val) => val !== undefined, {
    message: "Job type is required.",
  }),
  departmentId: z.string({
    required_error: "Job section is required.",
  }),
  dueDate: z
    .date({
      required_error: "Due date is required.",
    })
    .min(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), {
      message: "Due date must be at least 3 days in the future",
    }),
  images: z.array(z.instanceof(File)).optional(),
});

export type CreateJobRequestSchema = z.infer<typeof createjobRequestSchema>;
