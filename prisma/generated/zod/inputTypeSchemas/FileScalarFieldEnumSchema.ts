import { z } from 'zod';

export const FileScalarFieldEnumSchema = z.enum(['id','url','filePurpose','departmentId']);

export default FileScalarFieldEnumSchema;
