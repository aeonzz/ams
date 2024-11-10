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

export const createReturnableResourceRequest = authedProcedure
  .createServerAction()
  .input(extendedReturnableResourceRequestSchema)
  .handler(async ({ ctx, input }) => {
    const { user } = ctx;

    const { path, ...rest } = input;

    try {
      const { text } = await generateText({
        model: cohere("command-r-plus"),
        system: `You are an expert at creating concise, informative titles for work requests. 
                 Your task is to generate clear, action-oriented titles that quickly convey 
                 the nature of the request. Always consider the job type, category, and specific 
                 name of the task when crafting the title. Aim for brevity and clarity. And make it unique for every request. Dont add quotes`,
        prompt: `Create a clear and concise title for a request based on these details:
                 Notes: 
                 ${input.type} request
                 ${rest.purpose}

                 
                 Guidelines:
                 1. Keep it under 50 characters
                 2. Include the job type, category, and name in the title
                 3. Capture the main purpose of the request
                 4. Use action-oriented language
                 5. Be specific to the request's context
                 6. Make it easy to understand at a glance
                 7. Use title case
                 
                 Example: 
                 If given:
                 Notes: Fix leaking faucet in the main office bathroom
                 Job Type: Maintenance
                 Category: Building
                 Name: Plumbing
                 
                 A good title might be:
                 "Urgent Plumbing Maintenance: Office Bathroom Faucet Repair"
                 
                 Now, create a title for the request using the provided details above.`,
      });

      const requestId = `REQ-${generateId(3)}`;
      const resourceRequestId = `RRQ-${generateId(3)}`;

      const createdRequest = await db.request.create({
        data: {
          id: requestId,
          userId: user.id,
          priority: rest.priority,
          type: rest.type,
          title: text,
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

      await createNotification({
        resourceId: `/request/${createdRequest.id}`,
        title: `New Borrow Request: ${createdRequest.title}`,
        resourceType: "REQUEST",
        notificationType: "INFO",
        message: `A new borrow request titled "${createdRequest.title}" has been submitted. Please review the request and take the necessary actions.`,
        recepientIds: [createdRequest.departmentId],
        userId: user.id,
      });

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
      const { text } = await generateText({
        model: cohere("command-r-plus"),
        system: `You are an expert at creating concise, informative titles for work requests. 
                 Your task is to generate clear, action-oriented titles that quickly convey 
                 the nature of the request. Always consider the job type, category, and specific 
                 name of the task when crafting the title. Aim for brevity and clarity. And make it unique for every request. Dont add quotes`,
        prompt: `Create a clear and concise title for a request based on these details:
                 Notes: 
                 ${rest.type} request
                 ${rest.purpose}

                 
                 Guidelines:
                 1. Keep it under 50 characters
                 2. Include the job type, category, and name in the title
                 3. Capture the main purpose of the request
                 4. Use action-oriented language
                 5. Be specific to the request's context
                 6. Make it easy to understand at a glance
                 7. Use title case
                 
                 Example: 
                 If given:
                 Notes: Fix leaking faucet in the main office bathroom
                 Job Type: Maintenance
                 Category: Building
                 Name: Plumbing
                 
                 A good title might be:
                 "Urgent Plumbing Maintenance: Office Bathroom Faucet Repair"
                 
                 Now, create a title for the request using the provided details above.`,
      });

      const requestId = `REQ-${generateId(3)}`;
      const resourceRequestId = `RRQ-${generateId(3)}`;

      const createdRequest = await db.request.create({
        data: {
          id: requestId,
          userId: user.id,
          priority: rest.priority,
          type: rest.type,
          title: text,
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

      await createNotification({
        resourceId: `/request/${createdRequest.id}`,
        title: `New Job Request: ${createdRequest.title}`,
        resourceType: "REQUEST",
        notificationType: "INFO",
        message: `A new supply request titled "${createdRequest.title}" has been submitted. Please review the details and take the necessary actions.`,
        recepientIds: [createdRequest.departmentId],
        userId: user.id,
      });

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

      return revalidatePath(path);
    } catch (error) {
      return getErrorMessage(error);
    }
  });
