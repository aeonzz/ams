import { RequestStatusTypeSchema } from "prisma/generated/zod";
import { z } from "zod";

export const transportRequestActions = z.object({
  path: z.string(),
  requestId: z.string(),
  status: RequestStatusTypeSchema,
  odometer: z.number(),
});

export type TransportRequestActions = z.infer<typeof transportRequestActions>;
