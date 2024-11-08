"use server";

import { checkAuth } from "../auth/utils";
import { db } from "@/lib/db/index";
import { authedProcedure, convertToBase64, getErrorMessage } from "./utils";
import placeholder from "public/placeholder.svg";
import { type InventorySubItem } from "prisma/generated/zod";
import { generateId } from "lucia";
import { revalidatePath } from "next/cache";
import { GetInventorySubItemSchema } from "../schema";
import {
  deleteInventorySubItemsSchema,
  extendCreateInventoryItemSchema,
  extendedUpdateInventoryItemSchema,
  extendedUpdateInventorySubItemItemServerSchema,
  updateInventorySubItemStatusesSchema,
  updateReturnableResourceRequestSchemaWithPath,
} from "../schema/resource/returnable-resource";

export async function getInventorySubItems(
  input: GetInventorySubItemSchema & { inventoryId: string }
) {
  await checkAuth();
  const { page, per_page, sort, subName, from, to, inventoryId } = input;

  try {
    const skip = (page - 1) * per_page;

    const [column, order] = (sort?.split(".") ?? ["createdAt", "desc"]) as [
      keyof InventorySubItem | undefined,
      "asc" | "desc" | undefined,
    ];

    const where: any = {
      isArchived: false,
      inventoryId: inventoryId,
    };

    if (subName) {
      where.subName = { contains: subName, mode: "insensitive" };
    }

    if (from && to) {
      where.createdAt = {
        gte: new Date(from),
        lte: new Date(to),
      };
    }

    const [data, total] = await db.$transaction([
      db.inventorySubItem.findMany({
        where,
        take: per_page,
        skip,
        orderBy: {
          [column || "createdAt"]: order || "desc",
        },
        include: {
          inventory: true,
        },
      }),
      db.inventorySubItem.count({ where }),
    ]);

    const pageCount = Math.ceil(total / per_page);

    const modifiedData = await Promise.all(
      data.map(async (item) => {
        return {
          id: item.id,
          name: item.subName,
          subName: item.subName,
          serialNumber: item.serialNumber,
          description: item.inventory.description,
          status: item.status,
          imageUrl: item.imageUrl,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        };
      })
    );

    return { data: modifiedData, pageCount };
  } catch (err) {
    console.error(err);
    return { data: [], pageCount: 0 };
  }
}

export const createInventorySubItem = authedProcedure
  .createServerAction()
  .input(extendCreateInventoryItemSchema)
  .handler(async ({ input, ctx }) => {
    const { path, imageUrl, ...rest } = input;
    try {
      const itemId = generateId(15);
      const result = await db.inventorySubItem.create({
        data: {
          id: itemId,
          imageUrl: imageUrl[0],
          ...rest,
        },
      });

      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });

export const updateInventorySubItem = authedProcedure
  .createServerAction()
  .input(extendedUpdateInventoryItemSchema)
  .handler(async ({ ctx, input }) => {
    const { path, id, imageUrl, ...rest } = input;
    try {
      await db.inventorySubItem.update({
        where: {
          id: id,
        },
        data: {
          imageUrl: imageUrl && imageUrl[0],
          ...rest,
        },
      });

      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });

export const updateInventorySubItemStatuses = authedProcedure
  .createServerAction()
  .input(updateInventorySubItemStatusesSchema)
  .handler(async ({ input }) => {
    const { path, ...rest } = input;
    try {
      await db.inventorySubItem.updateMany({
        where: {
          id: {
            in: rest.ids,
          },
        },
        data: {
          ...(rest.status !== undefined && { status: rest.status }),
        },
      });

      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });

export const deleteInventorySubItems = authedProcedure
  .createServerAction()
  .input(deleteInventorySubItemsSchema)
  .handler(async ({ input }) => {
    const { path, ...rest } = input;

    try {
      await db.inventorySubItem.deleteMany({
        where: {
          id: {
            in: rest.ids,
          },
        },
      });

      return revalidatePath(path);
    } catch (error) {
      console.log(error);
      getErrorMessage(error);
    }
  });

export const returnableResourceActions = authedProcedure
  .createServerAction()
  .input(updateReturnableResourceRequestSchemaWithPath)
  .handler(async ({ input }) => {
    const {
      path,
      id,
      itemStatus,
      itemId,
      isReturned,
      returnCondition,
      ...rest
    } = input;
    try {
      const result = await db.$transaction(async (prisma) => {
        const updatedRequest = await prisma.returnableRequest.update({
          where: {
            requestId: id,
          },
          data: {
            item: {
              update: {
                status: itemStatus,
              },
            },
            ...(isReturned !== undefined && isReturned
              ? {
                  isReturned: true,
                  inProgress: false,
                  actualReturnDate: new Date(),
                  returnCondition: returnCondition,
                  request: {
                    update: {
                      status: "COMPLETED",
                      completedAt: new Date(),
                    },
                  },
                }
              : {}),
            ...rest,
          },
          include: {
            request: {
              include: {
                user: true,
                department: {
                  include: {
                    departmentBorrowingPolicy: true,
                  },
                },
              },
            },
          },
        });

        if (
          updatedRequest.isOverdue &&
          updatedRequest.request.department.departmentBorrowingPolicy &&
          updatedRequest.request.department.departmentBorrowingPolicy
            .penaltyBorrowBanDuration !== null
        ) {
          await prisma.userBan.create({
            data: {
              id: generateId(15),
              userId: updatedRequest.request.userId,
              departmentId: updatedRequest.request.department.id,
              bannedAt: new Date(),
              banDuration:
                updatedRequest.request.department.departmentBorrowingPolicy
                  .penaltyBorrowBanDuration,
              reason: "Overdue item return",
            },
          });

          await prisma.notification.create({
            data: {
              id: generateId(15),
              userId: updatedRequest.request.user.id,
              recepientId: updatedRequest.request.user.id,
              resourceId: `/request/${updatedRequest.requestId}`,
              title: `Overdue Request Ban`,
              resourceType: "REQUEST",
              notificationType: "ALERT",
              message: `Your account has been temporarily banned from submitting borrow requests in the ${updatedRequest.request.department.name} department for ${updatedRequest.request.department.departmentBorrowingPolicy.penaltyBorrowBanDuration} hours due to an overdue item return.`,
            },
          });
        }

        return updatedRequest;
      });

      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });
