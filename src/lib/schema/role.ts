import { z } from "zod";

export const roleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export type RoleSchema = z.infer<typeof roleSchema>;

export const roleSchemaWithPath = roleSchema.extend({
  path: z.string(),
});

export type RoleSchemaWithPath = z.infer<typeof roleSchemaWithPath>;