import { z } from 'zod';

export const ResourceTypeSchema = z.enum(['JOB','REQUEST','FILE','TASK','REWORK']);

export type ResourceTypeType = `${z.infer<typeof ResourceTypeSchema>}`

export default ResourceTypeSchema;
