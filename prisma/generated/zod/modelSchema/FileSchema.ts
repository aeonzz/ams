import { z } from 'zod';
import { FilePurposeSchema } from '../inputTypeSchemas/FilePurposeSchema'
import type { DepartmentWithRelations } from './DepartmentSchema'
import { DepartmentWithRelationsSchema } from './DepartmentSchema'

/////////////////////////////////////////
// FILE SCHEMA
/////////////////////////////////////////

export const FileSchema = z.object({
  filePurpose: FilePurposeSchema,
  id: z.string(),
  url: z.string(),
  departmentId: z.string().nullable(),
})

export type File = z.infer<typeof FileSchema>

/////////////////////////////////////////
// FILE RELATION SCHEMA
/////////////////////////////////////////

export type FileRelations = {
  department?: DepartmentWithRelations | null;
};

export type FileWithRelations = z.infer<typeof FileSchema> & FileRelations

export const FileWithRelationsSchema: z.ZodType<FileWithRelations> = FileSchema.merge(z.object({
  department: z.lazy(() => DepartmentWithRelationsSchema).nullable(),
}))

export default FileSchema;
