"use server";

import { generateId } from "lucia";
import { authedProcedure, getErrorMessage } from "./utils";
import { db } from "@/lib/db/index";
import { revalidatePath } from "next/cache";
import { createMaintenanceRecordSchemaWithPath } from "@/app/(app)/department/[departmentId]/resources/transport/vehicles/[vehicleId]/_components/schema";
import { GetVehicleMaintenanceHistory } from "../schema";
import type { MaintenanceHistory } from "prisma/generated/zod";
import { checkAuth } from "../auth/utils";

export async function getVehicleMaintenanceRecord(
  input: GetVehicleMaintenanceHistory & { vehicleId: string }
) {
  await checkAuth();
  const { page, per_page, sort, from, to, description, vehicleId } = input;

  try {
    const skip = (page - 1) * per_page;

    const [column, order] = (sort?.split(".") ?? ["createdAt", "desc"]) as [
      keyof MaintenanceHistory | undefined,
      "asc" | "desc" | undefined,
    ];

    const where: any = {
      vehicleId: vehicleId,
    };

    if (description) {
      where.description = { contains: description, mode: "insensitive" };
    }

    if (from && to) {
      where.createdAt = {
        gte: new Date(from),
        lte: new Date(to),
      };
    }

    const [data, total, vehicle] = await db.$transaction([
      db.maintenanceHistory.findMany({
        where,
        take: per_page,
        skip,
        orderBy: {
          [column || "createdAt"]: order || "desc",
        },
      }),
      db.maintenanceHistory.count({ where }),
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
      return {
        ...data,
      };
    });

    return { data: formattedData, pageCount, vehicle };
  } catch (err) {
    console.error(err);
    return { data: [], pageCount: 0 };
  }
}

export const createMaintenanceHistory = authedProcedure
  .createServerAction()
  .input(createMaintenanceRecordSchemaWithPath)
  .handler(async ({ input }) => {
    const { path, ...rest } = input;
    try {
      const result = await db.maintenanceHistory.create({
        data: {
          id: generateId(15),
          ...rest,
        },
      });

      await db.vehicle.update({
        where: {
          id: rest.vehicleId,
        },
        data: {
          odometer: rest.odometer,
          requiresMaintenance: false,
          status: "AVAILABLE",
        },
      });

      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });
