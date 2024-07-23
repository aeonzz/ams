import { z } from "zod";

export const RequestSchema = z.object({
  notes: z
    .string()
    .min(10, { message: "Must be at least 10 characters long" })
    .max(200, { message: "Cannot be more than 200 characters long" }),
  images: z.array(z.instanceof(File)).optional(),
});

export type Request = z.infer<typeof RequestSchema>;
