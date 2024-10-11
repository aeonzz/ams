import { z } from 'zod';

export const NotificationTypeSchema = z.enum(['INFO','ALERT','REMINDER']);

export type NotificationTypeType = `${z.infer<typeof NotificationTypeSchema>}`

export default NotificationTypeSchema;
