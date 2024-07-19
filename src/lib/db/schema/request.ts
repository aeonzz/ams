import { z } from "zod";

export const RequestSchema = z.object({
  notes: z
    .string()
    .min(1, { message: "Must be at least 1 characters long" })
    .max(200, { message: "Cannot be more than 200 characters long" }),
});

export type Request = z.infer<typeof RequestSchema>;
