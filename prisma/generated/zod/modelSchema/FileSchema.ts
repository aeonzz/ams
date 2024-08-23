import { z } from 'zod';
import type { JobRequestWithRelations } from './JobRequestSchema'
import { JobRequestWithRelationsSchema } from './JobRequestSchema'

/////////////////////////////////////////
// FILE SCHEMA
/////////////////////////////////////////

export const FileSchema = z.object({
  id: z.string(),
  url: z.string(),
  blurDataUrl: z.string().nullable(),
  jobRequestId: z.string().nullable(),
})

export type File = z.infer<typeof FileSchema>

/////////////////////////////////////////
// FILE RELATION SCHEMA
/////////////////////////////////////////

export type FileRelations = {
  JobRequest?: JobRequestWithRelations | null;
};

export type FileWithRelations = z.infer<typeof FileSchema> & FileRelations

export const FileWithRelationsSchema: z.ZodType<FileWithRelations> = FileSchema.merge(z.object({
  JobRequest: z.lazy(() => JobRequestWithRelationsSchema).nullable(),
}))

export default FileSchema;
