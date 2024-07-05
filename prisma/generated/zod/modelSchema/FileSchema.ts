import { z } from 'zod';
import { FileCategorySchema } from '../inputTypeSchemas/FileCategorySchema'

/////////////////////////////////////////
// FILE SCHEMA
/////////////////////////////////////////

export const FileSchema = z.object({
  category: FileCategorySchema,
  id: z.string(),
  url: z.string(),
  blurDataUrl: z.string().nullable(),
  userId: z.string(),
})

export type File = z.infer<typeof FileSchema>

export default FileSchema;
