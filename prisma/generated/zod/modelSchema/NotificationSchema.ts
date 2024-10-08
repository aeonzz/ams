import { z } from 'zod';
import type { UserWithRelations } from './UserSchema'
import type { DepartmentWithRelations } from './DepartmentSchema'
import { UserWithRelationsSchema } from './UserSchema'
import { DepartmentWithRelationsSchema } from './DepartmentSchema'

/////////////////////////////////////////
// NOTIFICATION SCHEMA
/////////////////////////////////////////

export const NotificationSchema = z.object({
  id: z.string(),
  title: z.string(),
  message: z.string(),
  isRead: z.boolean(),
  resourceId: z.string(),
  userId: z.string().nullable(),
  departmentId: z.string().nullable(),
  createdAt: z.coerce.date(),
  readAt: z.coerce.date().nullable(),
  updatedAt: z.coerce.date(),
})

export type Notification = z.infer<typeof NotificationSchema>

/////////////////////////////////////////
// NOTIFICATION RELATION SCHEMA
/////////////////////////////////////////

export type NotificationRelations = {
  user?: UserWithRelations | null;
  department?: DepartmentWithRelations | null;
};

export type NotificationWithRelations = z.infer<typeof NotificationSchema> & NotificationRelations

export const NotificationWithRelationsSchema: z.ZodType<NotificationWithRelations> = NotificationSchema.merge(z.object({
  user: z.lazy(() => UserWithRelationsSchema).nullable(),
  department: z.lazy(() => DepartmentWithRelationsSchema).nullable(),
}))

export default NotificationSchema;
