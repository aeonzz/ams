import { z } from "zod";

export const uploadFileSchema = z.object({
  file: z.array(z.instanceof(File), {
    required_error: "File is required",
  }),
});

export type UploadFileSchema = z.infer<typeof uploadFileSchema>;
