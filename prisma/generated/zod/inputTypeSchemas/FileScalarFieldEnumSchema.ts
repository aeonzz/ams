import { z } from 'zod';

export const FileScalarFieldEnumSchema = z.enum(['id','url','blurDataUrl','jobRequestId']);

export default FileScalarFieldEnumSchema;
