import { z } from 'zod';

export const DepartmentTypeSchema = z.enum(['ACADEMIC','ADMINISTRATIVE','TECHNICAL']);

export type DepartmentTypeType = `${z.infer<typeof DepartmentTypeSchema>}`

export default DepartmentTypeSchema;
