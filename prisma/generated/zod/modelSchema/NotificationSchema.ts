import { z } from 'zod';
import { ResourceTypeSchema } from '../inputTypeSchemas/ResourceTypeSchema'
import { NotificationTypeSchema } from '../inputTypeSchemas/NotificationTypeSchema'
import type { UserWithRelations } from './UserSchema'
import { UserWithRelationsSchema } from './UserSchema'

/////////////////////////////////////////
// NOTIFICATION SCHEMA
/////////////////////////////////////////

export const NotificationSchema = z.object({
  resourceType: ResourceTypeSchema,
  notificationType: NotificationTypeSchema,
  id: z.string(),
  title: z.string(),
  userId: z.string(),
  message: z.string(),
  isRead: z.boolean(),
  resourceId: z.string().nullable(),
  recepientId: z.string(),
  createdAt: z.coerce.date(),
  readAt: z.coerce.date().nullable(),
  updatedAt: z.coerce.date(),
})

export type Notification = z.infer<typeof NotificationSchema>

/////////////////////////////////////////
// NOTIFICATION RELATION SCHEMA
/////////////////////////////////////////

export type NotificationRelations = {
  user: UserWithRelations;
};

export type NotificationWithRelations = z.infer<typeof NotificationSchema> & NotificationRelations

export const NotificationWithRelationsSchema: z.ZodType<NotificationWithRelations> = NotificationSchema.merge(z.object({
  user: z.lazy(() => UserWithRelationsSchema),
}))

export default NotificationSchema;
