import { z } from "zod";

export const serverUpdateUserSchema = z.object({
  email: z.string().email().optional(),
  profileUrl: z.string().optional(),
  username: z.string().optional(),
  path: z.string(),
});

export const clientUpdateUserSchema = z.object({
  email: z.string().email(),
  username: z.string().min(1, {
    message: "Username cannot be empty"
  }),
});

export type ClientUpdateUserSchema = z.infer<typeof clientUpdateUserSchema>;
