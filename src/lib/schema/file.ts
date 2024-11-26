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

export const updateVenueRulesSchema = z.object({
  text: z.string({
    required_error: "Content is required",
  }),
});

export type UpdateVenueRulesSchema = z.infer<typeof updateVenueRulesSchema>;

export const updateVenueRulesSchemaWithPath = updateVenueRulesSchema.extend({
  path: z.string(),
  venueId: z.string(),
});

export type UpdateVenueRulesSchemaWithPath = z.infer<
  typeof updateVenueRulesSchemaWithPath
>;
