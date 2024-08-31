"use server";

import { ReturnableItem } from "prisma/generated/zod";
import { checkAuth } from "../auth/utils";
import { type GetEquipmentSchema } from "../schema";
import { db } from "@/lib/db/index";
import { authedProcedure, convertToBase64, getErrorMessage } from "./utils";
import placeholder from "public/placeholder.svg";
import {
  createEquipmentSchemaWithPath,
  deleteEquipmentsSchema,
  extendedUpdateEquipmentServerSchema,
  updateEquipmentStatusesSchema,
} from "../schema/resource/returnable-resource";
import { generateId } from "lucia";
import { revalidatePath } from "next/cache";

export async function getEquipments(input: GetEquipmentSchema) {
  await checkAuth();
  const { page, per_page, sort, name, from, to } = input;

  try {
    const skip = (page - 1) * per_page;

    const [column, order] = (sort?.split(".") ?? ["createdAt", "desc"]) as [
      keyof ReturnableItem | undefined,
      "asc" | "desc" | undefined,
    ];

    const where: any = {};

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
      db.returnableItem.findMany({
        where,
        take: per_page,
        skip,
        orderBy: {
          [column || "createdAt"]: order || "desc",
        },
        include: {
          inventoryItems: {
            select: {
              id: true,
              status: true,
            },
          },
        },
      }),
      db.returnableItem.count({ where }),
    ]);

    const pageCount = Math.ceil(total / per_page);

    const dataWithInventoryAndImages = await Promise.all(
      data.map(async (item) => {
        let imageUrl = item.imageUrl || placeholder;

        try {
          if (item.imageUrl) {
            const result = await convertToBase64(item.imageUrl);
            if ("base64Url" in result) {
              imageUrl = result.base64Url;
            }
          }
        } catch (error) {
          console.error(`Error converting image for item ${item.id}:`, error);
          imageUrl = placeholder;
        }

        const inventoryCount = item.inventoryItems.length;
        const availableCount = item.inventoryItems.filter(
          (inv) => inv.status === "AVAILABLE"
        ).length;

        return {
          ...item,
          imageUrl: imageUrl,
          inventoryCount,
          availableCount,
          inventoryItems: item.inventoryItems,
        };
      })
    );

    return { data: dataWithInventoryAndImages, pageCount };
  } catch (err) {
    console.error(err);
    return { data: [], pageCount: 0 };
  }
}

export const createEquipment = authedProcedure
  .createServerAction()
  .input(createEquipmentSchemaWithPath)
  .handler(async ({ input, ctx }) => {
    const { path, imageUrl, inventoryCount, ...rest } = input;
    try {
      const itemId = generateId(15);

      await db.$transaction(async (tx) => {
        const returnableItem = await tx.returnableItem.create({
          data: {
            id: itemId,
            imageUrl: imageUrl[0],
            ...rest,
          },
        });

        const inventoryItems = await Promise.all(
          Array.from({ length: inventoryCount }, async (_, index) => {
            return tx.inventoryItem.create({
              data: {
                id: generateId(15),
                returnableItemId: returnableItem.id,
                status: "AVAILABLE",
              },
            });
          })
        );

        return { returnableItem, inventoryItems };
      });

      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });

export const updateEquipment = authedProcedure
  .createServerAction()
  .input(extendedUpdateEquipmentServerSchema)
  .handler(async ({ ctx, input }) => {
    const { path, id, imageUrl, ...rest } = input;
    try {
      await db.returnableItem.update({
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

export const updateEquipmentsStatuses = authedProcedure
  .createServerAction()
  .input(updateEquipmentStatusesSchema)
  .handler(async ({ input }) => {
    const { path, ...rest } = input;
    try {
      await db.returnableItem.updateMany({
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

export const deleteEquipments = authedProcedure
  .createServerAction()
  .input(deleteEquipmentsSchema)
  .handler(async ({ input }) => {
    const { path, ...rest } = input;

    try {
      await db.returnableItem.deleteMany({
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
