"use server";

import { checkAuth } from "../auth/utils";

import { db } from "@/lib/db/index";
import { GetVehicleSchema } from "../schema";
import { authedProcedure, getErrorMessage } from "./utils";
import { revalidatePath } from "next/cache";
import { generateId } from "lucia";
import { type Vehicle } from "prisma/generated/zod";
import {
  createVehicleSchemaWithPath,
  deleteVehiclesSchema,
  extendedUpdateVehicleServerSchema,
  updateVehicleStatusesSchema,
} from "../schema/vehicle";
import { convertToBase64 } from "./utils";
import placeholder from "public/placeholder.svg";

export async function getVehicles(input: GetVehicleSchema) {
  await checkAuth();
  const { page, per_page, sort, name, status, from, to } = input;

  try {
    const skip = (page - 1) * per_page;

    const [column, order] = (sort?.split(".") ?? ["createdAt", "desc"]) as [
      keyof Vehicle | undefined,
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

export const updateVehicle = authedProcedure
  .createServerAction()
  .input(extendedUpdateVehicleServerSchema)
  .handler(async ({ ctx, input }) => {
    const { path, id, imageUrl, ...rest } = input;
    try {
      await db.vehicle.update({
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

export const updateVehicleStatuses = authedProcedure
  .createServerAction()
  .input(updateVehicleStatusesSchema)
  .handler(async ({ input }) => {
    const { path, ...rest } = input;
    try {
      await db.vehicle.updateMany({
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

export const deleteVehicles = authedProcedure
  .createServerAction()
  .input(deleteVehiclesSchema)
  .handler(async ({ input }) => {
    const { path, ...rest } = input;

    try {
      await db.vehicle.deleteMany({
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
