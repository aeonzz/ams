import { z } from "zod";

export const ServerUpdateUserSchema = z.object({
  email: z.string().email().optional(),
  profileUrl: z.string().optional(),
  username: z.string().optional(),
  path: z.string(),
});

export const ClientUpdateUserSchema = z.object({
  email: z.string().email(),
  username: z
    .string()
    .min(1, {
      message: "Username cannot be empty",
    })
    .max(15),
});

export type User = z.infer<typeof ClientUpdateUserSchema>;
