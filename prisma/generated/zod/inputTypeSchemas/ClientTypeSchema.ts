import { z } from 'zod';

export const ClientTypeSchema = z.enum(['CITIZEN','BUSINESS','GOVERNMENT']);

export type ClientTypeType = `${z.infer<typeof ClientTypeSchema>}`

export default ClientTypeSchema;
