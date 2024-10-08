import { z } from "zod";

export const createNotificationSchema = z.object({
  title: z.string(),
  message: z.string(),
  resourceId: z.string(),
  userId: z.string().optional(),
  departmentId: z.string().optional(),
});

export type CreateNotificationSchema = z.infer<typeof createNotificationSchema>;

export const updateNotificationStatusSchema = z.object({
  notificationId: z.string(),
  isRead: z.boolean(),
});

export type UpdateNotificationStatusSchema = z.infer<
  typeof updateNotificationStatusSchema
>;
