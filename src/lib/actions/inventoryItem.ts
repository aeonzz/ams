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
  createInventorySubItemSchemaWithPath,
  deleteInventorySubItemsSchema,
  extendedUpdateInventorySubItemItemServerSchema,
  updateInventorySubItemStatusesSchema,
} from "../schema/resource/returnable-resource";

export async function getInventorySubItems(
  input: GetInventorySubItemSchema & { id: string }
) {
  await checkAuth();
  const { page, per_page, sort, name, id, from, to } = input;

  try {
    const skip = (page - 1) * per_page;

    const [column, order] = (sort?.split(".") ?? ["createdAt", "desc"]) as [
      keyof InventorySubItem | undefined,
      "asc" | "desc" | undefined,
    ];

    const where: any = {
      inventoryId: id,
    };

    if (name) {
      where.name = { contains: name, mode: "insensitive" };
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

    const dataWithInventorySubAndImages = await Promise.all(
      data.map(async (item) => {
        let imageUrl = item.inventory.imageUrl || placeholder;

        try {
          if (item.inventory.imageUrl) {
            const result = await convertToBase64(item.inventory.imageUrl);
            if ("base64Url" in result) {
              imageUrl = result.base64Url;
            }
          }
        } catch (error) {
          console.error(`Error converting image for item ${item.id}:`, error);
          imageUrl = placeholder;
        }

        return {
          id: item.id,
          name: item.inventory.name,
          description: item.inventory.description,
          status: item.status,
          imageUrl: imageUrl,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        };
      })
    );

    return { data: dataWithInventorySubAndImages, pageCount };
  } catch (err) {
    console.error(err);
    return { data: [], pageCount: 0 };
  }
}

export const createInventorySubItem = authedProcedure
  .createServerAction()
  .input(createInventorySubItemSchemaWithPath)
  .handler(async ({ input, ctx }) => {
    const { path, ...rest } = input;
    try {
      const itemId = generateId(15);
      const item = await db.inventorySubItem.create({
        data: {
          id: itemId,
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
  .input(extendedUpdateInventorySubItemItemServerSchema)
  .handler(async ({ ctx, input }) => {
    const { path, id, ...rest } = input;
    try {
      await db.inventorySubItem.update({
        where: {
          id: id,
        },
        data: {
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