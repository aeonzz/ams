import { z } from 'zod';

export const FileScalarFieldEnumSchema = z.enum(['id','url','blurDataUrl']);

export default FileScalarFieldEnumSchema;
