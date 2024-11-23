"use server";

import { checkAuth } from "../auth/utils";

import { db } from "@/lib/db/index";
import { GetInventorySubItemSchema, GetVehicleSchema } from "../schema";
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
import { formatFullName } from "../utils";

export async function getVehicles(input: GetVehicleSchema) {
  await checkAuth();
  const { page, per_page, sort, name, status, from, to } = input;

  try {
    const skip = (page - 1) * per_page;

    const [column, order] = (sort?.split(".") ?? ["createdAt", "desc"]) as [
      keyof Vehicle | undefined,
      "asc" | "desc" | undefined,
    ];

    const where: any = {
      isArchived: false,
    };

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
        include: {
          department: true,
        },
      }),
      db.vehicle.count({ where }),
    ]);
    const pageCount = Math.ceil(total / per_page);

    const formattedData = data.map((vehicle) => {
      return {
        ...vehicle,
        departmentName: vehicle.department.name,
      };
    });

    return { data: formattedData, pageCount };
  } catch (err) {
    console.error(err);
    return { data: [], pageCount: 0 };
  }
}

export async function getRequestByVehicleId(
  input: GetVehicleSchema & { vehicleId: string }
) {
  await checkAuth();
  const { page, per_page, sort, name, from, to, vehicleId } = input;

  try {
    const skip = (page - 1) * per_page;

    const [column, order] = (sort?.split(".") ?? ["createdAt", "desc"]) as [
      keyof Vehicle | undefined,
      "asc" | "desc" | undefined,
    ];

    const where: any = {
      vehicleId: vehicleId,
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

    const [data, total, vehicle] = await db.$transaction([
      db.transportRequest.findMany({
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
        },
      }),
      db.transportRequest.count({ where }),
      db.vehicle.findUnique({
        where: {
          id: vehicleId,
        },
        select: {
          name: true,
        },
      }),
    ]);
    const pageCount = Math.ceil(total / per_page);

    const formattedData = data.map((data) => {
      const { request, id, createdAt, updatedAt, ...rest } = data;
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
      };
    });

    return { data: formattedData, pageCount, vehicle };
  } catch (err) {
    console.error(err);
    return { data: [], pageCount: 0 };
  }
}

export const createVehicle = authedProcedure
  .createServerAction()
  .input(createVehicleSchemaWithPath)
  .handler(async ({ input, ctx }) => {
    const { path, imageUrl, departmentId, ...rest } = input;
    const { user } = ctx;
    try {
      const result = await db.$transaction(async (prisma) => {
        const vehicleId = generateId(3);

        const createVehicle = await prisma.vehicle.create({
          data: {
            id: vehicleId,
            imageUrl: imageUrl[0],
            departmentId: departmentId,
            ...rest,
          },
        });
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
    const { user } = ctx;
    try {
      const result = await db.$transaction(async (prisma) => {
        const updateVehicle = await db.vehicle.update({
          where: {
            id: id,
          },
          data: {
            imageUrl: imageUrl && imageUrl[0],
            ...rest,
          },
        });
        return updateVehicle;
      });

      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });

export const updateVehicleStatuses = authedProcedure
  .createServerAction()
  .input(updateVehicleStatusesSchema)
  .handler(async ({ input, ctx }) => {
    const { path, ids, ...rest } = input;
    const { user } = ctx;
    try {
      const result = await db.$transaction(async (prisma) => {
        const currentVehicles = await prisma.vehicle.findMany({
          where: { id: { in: ids } },
        });

        if (!currentVehicles || currentVehicles.length === 0) {
          throw "Vehicle not found";
        }
        await db.vehicle.updateMany({
          where: {
            id: {
              in: ids,
            },
          },
          data: {
            ...(rest.status !== undefined && { status: rest.status }),
          },
        });
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
