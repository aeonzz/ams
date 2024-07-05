import { z } from "zod";

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  profileUrl: z.string().optional(),
  name: z.string().optional(),
});
