import { z } from 'zod';

export const FileScalarFieldEnumSchema = z.enum(['id','url','blurDataUrl','category','userId']);

export default FileScalarFieldEnumSchema;
