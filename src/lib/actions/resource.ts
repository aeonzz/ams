"use server";

import { generateText } from "ai";
import { authedProcedure, getErrorMessage } from "./utils";
import { db } from "@/lib/db/index";
import { cohere } from "@ai-sdk/cohere";
import { generateId } from "lucia";
import { revalidatePath } from "next/cache";
import { extendedReturnableResourceRequestSchema } from "../schema/resource/returnable-resource";
import {
  addSupplyItemWithPath,
  extendedSupplyResourceRequestSchema,
  updateSupplyResourceRequestSchemaWithPath,
} from "../schema/resource/supply-resource";
import { createNotification } from "./notification";
import {
  deleteSupplyRequestItemSchema,
  extendedUpdateSupplyRequestItemSchema,
} from "../schema/resource/request-supply";
import { pusher } from "../pusher";
import { generateTitle } from "./ai";
import { sendEmailNotification } from "./email";

export const createReturnableResourceRequest = authedProcedure
  .createServerAction()
  .input(extendedReturnableResourceRequestSchema)
  .handler(async ({ ctx, input }) => {
    const { user } = ctx;

    const { path, ...rest } = input;

    try {
      const requestId = `REQ-${generateId(5)}`;
      const resourceRequestId = `RRQ-${generateId(5)}`;

      const item = await db.inventorySubItem.findUnique({
        where: {
          id: rest.itemId,
        },
      });

      if (!item) {
        throw "Item not found";
      }

      let title;
      try {
        const text = await generateTitle({
          type: input.type,
          inputs: [input.purpose, item.subName],
        });
        title = text.title || requestId;
      } catch (error) {
        console.error("Error in title generation:", error);
        title = requestId;
      }

      const createdRequest = await db.request.create({
        data: {
          id: requestId,
          userId: user.id,
          priority: rest.priority,
          type: rest.type,
          title: title,
          departmentId: rest.departmentId,
          returnableRequest: {
            create: {
              id: resourceRequestId,
              dateAndTimeNeeded: rest.dateAndTimeNeeded,
              returnDateAndTime: rest.returnDateAndTime,
              notes: rest.notes,
              purpose: rest.purpose,
              location: rest.location,
              itemId: rest.itemId,
            },
          },
        },
      });

      const departmentRoleUsers = await db.userRole.findMany({
        where: {
          departmentId: rest.departmentId,
          role: {
            name: {
              in: ["DEPARTMENT_HEAD", "OPERATIONS_MANAGER"],
            },
          },
        },
        include: {
          user: true,
        },
      });

      const recipientIds = departmentRoleUsers.map(
        (roleUser) => roleUser.userId
      );

      await createNotification({
        resourceId: `/request/${createdRequest.id}`,
        title: `New Borrow Request: ${createdRequest.title}`,
        resourceType: "REQUEST",
        notificationType: "INFO",
        message: `A new borrow request titled "${createdRequest.title}" has been submitted. Please review the request and take the necessary actions.`,
        recepientIds: [...recipientIds, createdRequest.departmentId],
        userId: user.id,
      });

      await sendEmailNotification({
        recipientIds: recipientIds,
        resourceId: `/request/${createdRequest.id}`,
        title: `New Borrow Request: ${createdRequest.title}`,
        payload: `A new borrow request titled "${createdRequest.title}" has been submitted. Please review the request and take the necessary actions.`,
      });

      try {
        await Promise.all([
          pusher.trigger("request", "request_update", { message: "" }),
          pusher.trigger("request", "notifications", { message: "" }),
        ]);
      } catch (pusherError) {
        console.error("Failed to send Pusher notifications:", pusherError);
      }

      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });

export const createSupplyResourceRequest = authedProcedure
  .createServerAction()
  .input(extendedSupplyResourceRequestSchema)
  .handler(async ({ ctx, input }) => {
    const { user } = ctx;

    const { path, ...rest } = input;

    try {
      const requestId = `REQ-${generateId(5)}`;
      const resourceRequestId = `RRQ-${generateId(5)}`;

      let title;
      try {
        const text = await generateTitle({
          type: input.type,
          inputs: [input.purpose],
        });
        title = text.title || requestId;
      } catch (error) {
        console.error("Error in title generation:", error);
        title = requestId;
      }

      const createdRequest = await db.request.create({
        data: {
          id: requestId,
          userId: user.id,
          priority: rest.priority,
          type: rest.type,
          title: title,
          departmentId: rest.departmentId,
          supplyRequest: {
            create: {
              id: resourceRequestId,
              dateAndTimeNeeded: rest.dateAndTimeNeeded,
              purpose: rest.purpose,
              items: {
                create: rest.items.map((item) => ({
                  id: generateId(3),
                  quantity: item.quantity,
                  supplyItemId: item.supplyItemId,
                })),
              },
            },
          },
        },
      });

      const departmentRoleUsers = await db.userRole.findMany({
        where: {
          departmentId: rest.departmentId,
          role: {
            name: {
              in: ["DEPARTMENT_HEAD", "OPERATIONS_MANAGER"],
            },
          },
        },
        include: {
          user: true,
        },
      });

      const recipientIds = departmentRoleUsers.map(
        (roleUser) => roleUser.userId
      );

      await createNotification({
        resourceId: `/request/${createdRequest.id}`,
        title: `New Supply Request: ${createdRequest.title}`,
        resourceType: "REQUEST",
        notificationType: "INFO",
        message: `A new supply request titled "${createdRequest.title}" has been submitted. Please review the details and take the necessary actions.`,
        recepientIds: [...recipientIds, createdRequest.departmentId],
        userId: user.id,
      });

      await sendEmailNotification({
        recipientIds: recipientIds,
        resourceId: `/request/${createdRequest.id}`,
        title: `New Supply Request: ${createdRequest.title}`,
        payload: `A new supply request titled "${createdRequest.title}" has been submitted. Please review the details and take the necessary actions.`,
      });

      try {
        await Promise.all([
          pusher.trigger("request", "request_update", { message: "" }),
          pusher.trigger("request", "notifications", { message: "" }),
        ]);
      } catch (pusherError) {
        console.error("Failed to send Pusher notifications:", pusherError);
      }

      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });

export const updateSupplyRequest = authedProcedure
  .createServerAction()
  .input(updateSupplyResourceRequestSchemaWithPath)
  .handler(async ({ input }) => {
    const { path, id, items, ...rest } = input;

    try {
      const updatedSupplyRequest = await db.supplyRequest.update({
        where: {
          requestId: id,
        },
        data: {
          ...rest,
        },
      });

      await pusher.trigger("request", "request_update", {
        message: "",
      });

      return revalidatePath(path);
    } catch (error) {
      return getErrorMessage(error);
    }
  });

export const updateRequestSupplyItem = authedProcedure
  .createServerAction()
  .input(extendedUpdateSupplyRequestItemSchema)
  .handler(async ({ input }) => {
    const { path, id, ...rest } = input;

    try {
      const result = await db.supplyRequestItem.update({
        where: {
          id: id,
        },
        data: {
          ...rest,
        },
      });

      await pusher.trigger("request", "request_update", {
        message: "",
      });

      return revalidatePath(path);
    } catch (error) {
      return getErrorMessage(error);
    }
  });

export const deleteRequestSupplyItem = authedProcedure
  .createServerAction()
  .input(deleteSupplyRequestItemSchema)
  .handler(async ({ input }) => {
    const { path, id } = input;

    try {
      const result = await db.supplyRequestItem.delete({
        where: {
          id: id,
        },
      });

      await pusher.trigger("request", "request_update", {
        message: "",
      });

      return revalidatePath(path);
    } catch (error) {
      return getErrorMessage(error);
    }
  });

export const createSupplyItemRequest = authedProcedure
  .createServerAction()
  .input(addSupplyItemWithPath)
  .handler(async ({ input }) => {
    const { path, id, items } = input;

    try {
      await Promise.all(
        items.map(async (item) => {
          await db.supplyRequestItem.create({
            data: {
              id: generateId(3),
              supplyRequestId: id,
              supplyItemId: item.supplyItemId,
              quantity: item.quantity,
            },
          });
        })
      );

      await pusher.trigger("request", "request_update", {
        message: "",
      });

      return revalidatePath(path);
    } catch (error) {
      return getErrorMessage(error);
    }
  });
