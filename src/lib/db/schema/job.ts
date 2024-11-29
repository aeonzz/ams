import { requestSchemaBase } from "@/lib/schema/request";
import { z } from "zod";

export const createJobRequestSchemaServer = z.object({
  description: z.string(),
  images: z.array(z.string()).optional(),
  departmentId: z.string(),
  location: z.string(),
  jobType: z.string(),
  department: z.string(),
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

export const uploadProofImagesSchema = z.object({
  proofImages: z.array(z.string()).optional(),
});

export const uploadProofImagesSchemaWithPath = uploadProofImagesSchema.extend({
  requestId: z.string(),
  path: z.string(),
});

export type UploadProofImagesSchema = z.infer<typeof uploadProofImagesSchema>;
