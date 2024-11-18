"use server";

import { generateId } from "lucia";
import { authedProcedure, getErrorMessage } from "./utils";
import { db } from "@/lib/db/index";
import { revalidatePath } from "next/cache";
import { createMaintenanceRecordSchemaWithPath } from "@/app/(app)/department/[departmentId]/resources/transport/[vehicleId]/_components/schema";

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

      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });
