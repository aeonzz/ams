import { z } from 'zod';

export const FileCategorySchema = z.enum(['PROFILE']);

export type FileCategoryType = `${z.infer<typeof FileCategorySchema>}`

export default FileCategorySchema;
