"use server";

import { generateId } from "lucia";
import { authedProcedure, getErrorMessage } from "./utils";

import { db } from "@/lib/db/index";
import {
  createNotificationSchema,
  deleteNotificationStatusSchema,
  updateNotificationStatusSchema,
} from "../schema/notification";
import { revalidatePath } from "next/cache";

export const createNotification = authedProcedure
  .createServerAction()
  .input(createNotificationSchema)
  .handler(async ({ input }) => {
    const { departmentId, userId, ...rest } = input;
    try {
      const result = await db.notification.create({
        data: {
          id: generateId(15),
          departmentId: departmentId,
          userId: userId,
          ...rest,
        },
      });

      return result;
    } catch (error) {
      getErrorMessage(error);
    }
  });

export const updateNotificationStatus = authedProcedure
  .createServerAction()
  .input(updateNotificationStatusSchema)
  .handler(async ({ input }) => {
    const { notificationId, ...rest } = input;
    try {
      const result = await db.notification.update({
        where: {
          id: notificationId,
        },
        data: {
          ...rest,
        },
      });

      return result;
    } catch (error) {
      getErrorMessage(error);
    }
  });

export const deleteNotification = authedProcedure
  .createServerAction()
  .input(deleteNotificationStatusSchema)
  .handler(async ({ input }) => {
    const { notificationId } = input;
    try {
      const result = await db.notification.delete({
        where: {
          id: notificationId,
        },
      });

      return result;
    } catch (error) {
      getErrorMessage(error);
    }
  });
