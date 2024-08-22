import { z } from "zod";

export const RequestSchema = z.object({
  notes: z
    .string()
    .min(10, { message: "Must be at least 10 characters long" })
    .max(600, { message: "Cannot be more than 600 characters long" }),
  images: z.array(z.instanceof(File)).optional(),
  dueDate: z.date({
    required_error: "Due date is required.",
  }),
});

export type Request = z.infer<typeof RequestSchema>;
