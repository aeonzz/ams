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
import { type GetInventoryItemSchema } from "../schema";

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

export const createInventory = authedProcedure
  .createServerAction()
  .input(createInventoryItemSchemaWithPath)
  .handler(async ({ input, ctx }) => {
    const { path, imageUrl, inventoryCount, ...rest } = input;

    try {
      const itemId = generateId(15);

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
            id: generateId(15),
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
