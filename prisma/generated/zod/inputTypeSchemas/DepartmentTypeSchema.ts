import { z } from 'zod';

export const DepartmentTypeSchema = z.enum(['ACADEMIC','ADMINISTRATIVE','TECHNICAL','SUPPORT']);

export type DepartmentTypeType = `${z.infer<typeof DepartmentTypeSchema>}`

export default DepartmentTypeSchema;
