import {
  NotificationTypeSchema,
  ResourceTypeSchema,
} from "prisma/generated/zod";
import { z } from "zod";

export const createNotificationSchema = z.object({
  title: z.string(),
  message: z.string(),
  resourceId: z.string(),
  resourceType: ResourceTypeSchema,
  notificationType: NotificationTypeSchema.optional(),
  userId: z.string(),
  recepientIds: z.array(z.string()),
});

export type CreateNotificationSchema = z.infer<typeof createNotificationSchema>;

export const updateNotificationStatusSchema = z.object({
  notificationId: z.string(),
  isRead: z.boolean(),
});

export type UpdateNotificationStatusSchema = z.infer<
  typeof updateNotificationStatusSchema
>;

export const deleteNotificationStatusSchema = z.object({
  notificationId: z.string(),
});

export type DeleteNotificationStatusSchema = z.infer<
  typeof deleteNotificationStatusSchema
>;
