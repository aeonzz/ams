import { z } from "zod";

export const serverUpdateUserSchema = z.object({
  email: z.string().email().optional(),
  profileUrl: z.string().optional(),
  username: z.string().optional(),
  path: z.string(),
});

export const clientUpdateUserSchema = z.object({
  email: z.string().email(),
  username: z.string(),
});

export type ClientUpdateUserSchema = z.infer<typeof clientUpdateUserSchema>;
