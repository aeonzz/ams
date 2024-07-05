import { z } from 'zod';

/////////////////////////////////////////
// FILE SCHEMA
/////////////////////////////////////////

export const FileSchema = z.object({
  id: z.string(),
  url: z.string(),
  blurDataUrl: z.string().nullable(),
  userId: z.string(),
})

export type File = z.infer<typeof FileSchema>

export default FileSchema;
