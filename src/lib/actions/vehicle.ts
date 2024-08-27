"use server";

import { checkAuth } from "../auth/utils";

import { db } from "@/lib/db/index";
import { GetVenuesSchema } from "../schema";
import { authedProcedure, getErrorMessage } from "./utils";
import { createVenueSchemaWithPath } from "../schema/venue";
import { revalidatePath } from "next/cache";
import { generateId } from "lucia";
import { Venue } from "prisma/generated/zod";
import { createVehicleSchemaWithPath } from "../schema/vehicle";
import { convertToBase64 } from "./utils";

export async function getVehicles(input: GetVenuesSchema) {
  await checkAuth();
  const { page, per_page, sort, name, status, from, to } = input;

  try {
    const skip = (page - 1) * per_page;

    const [column, order] = (sort?.split(".") ?? ["createdAt", "desc"]) as [
      keyof Venue | undefined,
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
      db.vehicle.findMany({
        where,
        take: per_page,
        skip,
        orderBy: {
          [column || "createdAt"]: order || "desc",
        },
      }),
      db.user.count({ where }),
    ]);
    const pageCount = Math.ceil(total / per_page);

    const dataWithBase64Images = await Promise.all(
      data.map(async (vehicle) => {
        if (vehicle.imageUrl) {
          try {
            const result = await convertToBase64(vehicle.imageUrl);
            if ("base64Url" in result) {
              return { ...vehicle, imageUrl: result.base64Url };
            }
          } catch (error) {
            console.error(
              `Error converting image for vehicle ${vehicle.id}:`,
              error
            );
          }
        }
        return vehicle;
      })
    );

    return { data: dataWithBase64Images, pageCount };
  } catch (err) {
    console.error(err);
    return { data: [], pageCount: 0 };
  }
}

export const createVehicle = authedProcedure
  .createServerAction()
  .input(createVehicleSchemaWithPath)
  .handler(async ({ input, ctx }) => {
    const { path, imageUrl, ...rest } = input;
    try {
      const vehicleId = generateId(15);
      await db.vehicle.create({
        data: {
          id: vehicleId,
          imageUrl: imageUrl[0],
          ...rest,
        },
      });

      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });
