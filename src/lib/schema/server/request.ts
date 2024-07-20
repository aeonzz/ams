import { PriorityTypeSchema } from "prisma/generated/zod";
import { z } from "zod";

export const RequestSchema = z.object({
  notes: z.string(),
  priority: PriorityTypeSchema,
  type: z.string(),
  department: z.string(),
  jobType: z.string().optional(),
  path: z.string(),
  name: z.string(),
  itemCategory: z.string(),
  brand: z.string().optional(),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  issueDescription: z.string(),
});
