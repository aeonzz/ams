"use server";

import { checkAuth } from "../auth/utils";
import { db } from "@/lib/db/index";
import { authedProcedure, convertToBase64, getErrorMessage } from "./utils";
import { type GetInventorySchema } from "../schema";
import placeholder from "public/placeholder.svg";
import { type InventoryItem } from "prisma/generated/zod";
import { createInventorytSchemaWithPath, extendedUpdateInventoryItemServerSchema } from "../schema/inventoryItem";
import { generateId } from "lucia";
import { revalidatePath } from "next/cache";

export async function getInventoryItems(
  input: GetInventorySchema & { id: string }
) {
  await checkAuth();
  const { page, per_page, sort, name, id, from, to } = input;

  try {
    const skip = (page - 1) * per_page;

    const [column, order] = (sort?.split(".") ?? ["createdAt", "desc"]) as [
      keyof InventoryItem | undefined,
      "asc" | "desc" | undefined,
    ];

    const where: any = {
      returnableItemId: id,
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
      db.inventoryItem.findMany({
        where,
        take: per_page,
        skip,
        orderBy: {
          [column || "createdAt"]: order || "desc",
        },
        include: {
          returnableItem: {
            select: {
              id: true,
              name: true,
              description: true,
              imageUrl: true,
            },
          },
        },
      }),
      db.inventoryItem.count({ where }),
    ]);

    const pageCount = Math.ceil(total / per_page);

    const dataWithInventoryAndImages = await Promise.all(
      data.map(async (item) => {
        let imageUrl = item.returnableItem.imageUrl || placeholder;

        try {
          if (item.returnableItem.imageUrl) {
            const result = await convertToBase64(item.returnableItem.imageUrl);
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
          name: item.returnableItem.name,
          description: item.returnableItem.description,
          status: item.status,
          imageUrl: imageUrl,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        };
      })
    );

    return { data: dataWithInventoryAndImages, pageCount };
  } catch (err) {
    console.error(err);
    return { data: [], pageCount: 0 };
  }
}

export const createInventoryItem = authedProcedure
  .createServerAction()
  .input(createInventorytSchemaWithPath)
  .handler(async ({ input, ctx }) => {
    const { path, ...rest } = input;
    try {
      const itemId = generateId(15);
      const item = await db.inventoryItem.create({
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

export const updateInventoryItem = authedProcedure
  .createServerAction()
  .input(extendedUpdateInventoryItemServerSchema)
  .handler(async ({ ctx, input }) => {
    const { path, id, ...rest } = input;
    try {
      await db.inventoryItem.update({
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
