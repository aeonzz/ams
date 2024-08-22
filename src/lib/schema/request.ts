import { z } from "zod";
import { PriorityTypeSchema, RequestTypeSchema } from "prisma/generated/zod";

export const RequestSchema = z.object({
  notes: z.string(),
  priority: PriorityTypeSchema,
  dueDate: z.date(),
  type: RequestTypeSchema,
  department: z.string(),
  jobType: z.string().optional(),
  name: z.string(),
  category: z.string(),
  files: z.array(z.string()),
  path: z.string(),
});

export type RequestSchemaType = z.infer<typeof RequestSchema>;
