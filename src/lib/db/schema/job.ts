import { requestSchemaBase } from "@/lib/schema/request";
import { JobTypeSchema } from "prisma/generated/zod";
import { z } from "zod";

export const createJobRequestSchemaServer = z.object({
  description: z.string(),
  images: z.array(z.string()).optional(),
  departmentId: z.string(),
  location: z.string(),
  jobType: z.string(),
});

export const createJobRequestSchemaServerWithPath =
  createJobRequestSchemaServer.extend({
    path: z.string(),
  });

export type CreateJobRequestSchemaServerWithPath = z.infer<
  typeof createJobRequestSchemaServerWithPath
>;

export const extendedJobRequestSchemaServer = requestSchemaBase.merge(
  createJobRequestSchemaServerWithPath
);

export type ExtendedJobRequestSchemaServer = z.infer<
  typeof extendedJobRequestSchemaServer
>;
