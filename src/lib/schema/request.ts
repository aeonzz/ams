import { z } from "zod";
import { PriorityTypeSchema } from "prisma/generated/zod";

export const RequestSchema = z.object({
  notes: z.string(),
  priority: PriorityTypeSchema,
  type: z.string(),
  department: z.string(),
  jobType: z.string().optional(),
  name: z.string(),
  category: z.string(),
  files: z.array(z.string()),
  path: z.string(),
});

export type RequestSchemaType = z.infer<typeof RequestSchema>;
