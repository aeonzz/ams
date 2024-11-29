"use server";

import { checkAuth } from "../auth/utils";
import { db } from "@/lib/db/index";
import { authedProcedure, convertToBase64, getErrorMessage } from "./utils";
import placeholder from "public/placeholder.svg";
import {
  createInventoryItemSchemaWithPath,
  deleteInventoryItemsSchema,
  extendedUpdateInventoryItemServerSchema,
  updateInventoryItemStatusesSchema,
} from "../schema/resource/returnable-resource";
import { generateId } from "lucia";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { type InventoryItem } from "prisma/generated/zod";
import { GetRequestsSchema, type GetInventoryItemSchema } from "../schema";
import { formatFullName } from "../utils";

export async function getInventory(input: GetInventoryItemSchema) {
  await checkAuth();
  const {
    page,
    per_page,
    sort,
    name,
    from,
    to,
    departmentName: deptName,
  } = input;

  try {
    const skip = (page - 1) * per_page;

    const [column, order] = (sort?.split(".") ?? ["createdAt", "desc"]) as [
      keyof InventoryItem | undefined,
      "asc" | "desc" | undefined,
    ];

    const where: any = {
      isArchived: false,
    };

    if (name) {
      where.name = { contains: name, mode: "insensitive" };
    }

    if (deptName) {
      const departments = deptName
        .split(".")
        .map((d) => d.trim().replace(/\+/g, " "));

      where.department = {
        name: {
          in: departments,
          mode: "insensitive",
        },
      };
    }

    if (from && to) {
      where.createdAt = {
        gte: new Date(from),
        lte: new Date(to),
      };
    }

    const [data, total, department] = await db.$transaction([
      db.inventoryItem.findMany({
        where,
        take: per_page,
        skip,
        orderBy: {
          [column || "createdAt"]: order || "desc",
        },
        include: {
          inventorySubItems: {
            orderBy: {
              createdAt: "desc",
            },
          },
          department: true,
        },
      }),
      db.inventoryItem.count({ where }),
      db.department.findMany(),
    ]);

    const pageCount = Math.ceil(total / per_page);

    const dataWithInventoryAndImages = await Promise.all(
      data.map(async (item) => {
        const inventoryCount = item.inventorySubItems.length;
        const availableCount = item.inventorySubItems.filter(
          (inv) => inv.status === "AVAILABLE"
        ).length;

        return {
          ...item,
          inventoryCount,
          availableCount,
          departmentName: item.department.name,
          inventorySubItems: item.inventorySubItems,
        };
      })
    );

    return {
      data: dataWithInventoryAndImages,
      pageCount,
      departments: department,
    };
  } catch (err) {
    console.error(err);
    return { data: [], pageCount: 0 };
  }
}

export async function getDepartmentBorrowableRequests(
  input: GetRequestsSchema
) {
  await checkAuth();
  const { page, per_page, sort, from, title, status, to, departmentId } = input;

  try {
    const skip = (page - 1) * per_page;

    const [column, order] = (sort?.split(".") ?? ["createdAt", "desc"]) as [
      keyof Request | undefined,
      "asc" | "desc" | undefined,
    ];

    const where: any = {
      request: {
        departmentId: departmentId,
      },
    };

    if (title) {
      where.title = { contains: title, mode: "insensitive" };
    }

    if (status) {
      where.status = status;
    }

    if (from && to) {
      where.createdAt = {
        gte: new Date(from),
        lte: new Date(to),
      };
    }

    const [data, total, department] = await db.$transaction([
      db.returnableRequest.findMany({
        where,
        take: per_page,
        skip,
        orderBy: {
          [column || "createdAt"]: order || "desc",
        },
        include: {
          request: {
            include: {
              user: true,
              reviewer: true,
            },
          },
          item: {
            select: {
              subName: true,
            },
          },
        },
      }),
      db.returnableRequest.count({ where }),
      db.department.findUnique({
        where: {
          id: departmentId,
        },
        select: {
          name: true,
        },
      }),
      // db.returnableRequest.findMany({
      //   where,
      //   orderBy: {
      //     [column || "createdAt"]: order || "desc",
      //   },
      //   select: {
      //     actualStart: true,
      //     dateAndTimeNeeded: true,
      //     request: {
      //       select: {
      //         id: true,
      //         title: true,
      //         status: true,
      //         createdAt: true,
      //         completedAt: true,
      //       },
      //     },
      //   },
      // }),
    ]);
    const pageCount = Math.ceil(total / per_page);

    const formattedData = data.map((data) => {
      const {
        request,
        id,
        createdAt,
        updatedAt,
        inProgress,
        isOverdue,
        isReturned,
        item,
        ...rest
      } = data;
      return {
        ...rest,
        id: request.id,
        completedAt: request.completedAt,
        title: request.title,
        requester: formatFullName(
          request.user.firstName,
          request.user.middleName,
          request.user.lastName
        ),
        reviewer: request.reviewer
          ? formatFullName(
              request.reviewer.firstName,
              request.reviewer.middleName,
              request.reviewer.lastName
            )
          : undefined,
        status: request.status,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
        itemName: item.subName,
        inProgress: request.status === "APPROVED" ? inProgress : null,
        isOverdue: request.status === "APPROVED" ? isOverdue : null,
        isReturned: request.status === "APPROVED" ? isReturned : null,
      };
    });

    return { data: formattedData, pageCount, department };
  } catch (err) {
    console.error(err);
    return { data: [], pageCount: 0 };
  }
}

export const createInventory = authedProcedure
  .createServerAction()
  .input(createInventoryItemSchemaWithPath)
  .handler(async ({ input, ctx }) => {
    const { path, imageUrl, inventoryCount, ...rest } = input;

    try {
      const itemId = generateId(3);

      const inventoryItem = await db.inventoryItem.create({
        data: {
          id: itemId,
          imageUrl: imageUrl[0],
          ...rest,
        },
      });

      const inventorySubItems = [];
      for (let i = 0; i < inventoryCount; i++) {
        const subItem = await db.inventorySubItem.create({
          data: {
            id: generateId(3),
            imageUrl: inventoryItem.imageUrl,
            inventoryId: inventoryItem.id,
            subName: `${rest.name}-${generateId(5)}`,
          },
        });
        inventorySubItems.push(subItem);
      }

      revalidatePath(path);

      return { inventoryItem, inventorySubItems };
    } catch (error) {
      getErrorMessage(error);
    }
  });

export const updateInventory = authedProcedure
  .createServerAction()
  .input(extendedUpdateInventoryItemServerSchema)
  .handler(async ({ ctx, input }) => {
    const { path, id, imageUrl, ...rest } = input;
    try {
      await db.inventoryItem.update({
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

export const updateInventoryStatuses = authedProcedure
  .createServerAction()
  .input(updateInventoryItemStatusesSchema)
  .handler(async ({ input }) => {
    const { path, ...rest } = input;
    try {
      await db.inventoryItem.updateMany({
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

export const deleteInventories = authedProcedure
  .createServerAction()
  .input(deleteInventoryItemsSchema)
  .handler(async ({ input }) => {
    const { path, ...rest } = input;

    try {
      await db.inventoryItem.updateMany({
        where: {
          id: {
            in: rest.ids,
          },
        },
        data: {
          isArchived: true,
        },
      });

      return revalidatePath(path);
    } catch (error) {
      console.log(error);
      getErrorMessage(error);
    }
  });
