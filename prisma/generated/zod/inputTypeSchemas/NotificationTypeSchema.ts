import { z } from 'zod';

export const NotificationTypeSchema = z.enum(['INFO','ALERT','REMINDER','SUCCESS','WARNING','APPROVAL']);

export type NotificationTypeType = `${z.infer<typeof NotificationTypeSchema>}`

export default NotificationTypeSchema;
