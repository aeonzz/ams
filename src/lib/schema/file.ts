import { FilePurposeSchema } from "prisma/generated/zod";
import { z } from "zod";

export const uploadFileSchemaServer = z.object({
  url: z.array(
    z.string({
      required_error: "Image is required",
    })
  ),
});

export type UploadFileSchemaServer = z.infer<typeof uploadFileSchemaServer>;

export const uploadFileSchemaServerWithPath = uploadFileSchemaServer.extend({
  path: z.string(),
  departmentId: z.string(),
  filePurpose: FilePurposeSchema,
});

export type UploadFileSchemaServerWithPath = z.infer<
  typeof uploadFileSchemaServerWithPath
>;

export const uploadVenueRulesFile = z.object({
  url: z.array(
    z.string({
      required_error: "Image is required",
    })
  ),
});

export type UploadVenueRulesFile = z.infer<typeof uploadVenueRulesFile>;

export const uploadVenueRulesFileWithPath = uploadVenueRulesFile.extend({
  path: z.string(),
  venueId: z.string(),
});

export type UploadVenueRulesFileWithPath = z.infer<typeof uploadVenueRulesFileWithPath>;
