import { z } from "zod";

export const RequestSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Must be at least 1 character" })
    .max(50, { message: "Cannot be more than 50 characters long" }),
  notes: z
    .string()
    .min(10, { message: "Must be at least 10 characters long" })
    .max(400, { message: "Cannot be more than 400 characters long" }),
  images: z.array(z.instanceof(File)).optional(),
});

export type Request = z.infer<typeof RequestSchema>;
