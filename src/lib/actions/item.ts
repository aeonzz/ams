"use server";

import { ReturnableItem } from "prisma/generated/zod";
import { checkAuth } from "../auth/utils";
import { type GetEquipmentSchema } from "../schema";
import { db } from "@/lib/db/index";
import { authedProcedure, convertToBase64, getErrorMessage } from "./utils";
import placeholder from "public/placeholder.svg";
import { createEquipmentSchemaWithPath } from "../schema/resource/returnable-resource";
import { generateId } from "lucia";
import { revalidatePath } from "next/cache";

export async function getEquipments(input: GetEquipmentSchema) {
  await checkAuth();
  const { page, per_page, sort, name, status, from, to } = input;

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

    if (status) {
      where.status = { in: status.split(".") };
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
      }),
      db.returnableItem.count({ where }),
    ]);
    const pageCount = Math.ceil(total / per_page);

    const dataWithBase64Images = await Promise.all(
      data.map(async (vehicle) => {
        let imageUrl = vehicle.imageUrl || placeholder;

        try {
          if (vehicle.imageUrl) {
            const result = await convertToBase64(vehicle.imageUrl);
            if ("base64Url" in result) {
              imageUrl = result.base64Url;
            }
          }
        } catch (error) {
          console.error(
            `Error converting image for vehicle ${vehicle.id}:`,
            error
          );
          imageUrl = placeholder;
        }
        return {
          ...vehicle,
          imageUrl: imageUrl,
        };
      })
    );
    return { data: dataWithBase64Images, pageCount };
  } catch (err) {
    console.error(err);
    return { data: [], pageCount: 0 };
  }
}

export const createEquipment = authedProcedure
  .createServerAction()
  .input(createEquipmentSchemaWithPath)
  .handler(async ({ input, ctx }) => {
    const { path, imageUrl, ...rest } = input;
    try {
      const itemId = generateId(15);
      await db.returnableItem.create({
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
