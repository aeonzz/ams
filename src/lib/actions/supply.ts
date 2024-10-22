"use server";

import { checkAuth } from "../auth/utils";
import { db } from "@/lib/db/index";
import { authedProcedure, convertToBase64, getErrorMessage } from "./utils";
import type { GetSupplyItemSchema } from "../schema";
import type { SupplyItem } from "prisma/generated/zod";
import { generateId } from "lucia";
import {
  createSupplyItemSchemaServerWithPath,
  deleteSupplyItemsSchema,
  extendedUpdateSupplyItemSchema,
  updateSupplyItemItemStatusesSchema,
} from "../schema/resource/supply-resource";
import { revalidatePath } from "next/cache";

export async function getSupply(input: GetSupplyItemSchema) {
  await checkAuth();
  const {
    page,
    per_page,
    sort,
    name,
    status,
    departmentName: deptName,
    from,
    to,
  } = input;

  try {
    const skip = (page - 1) * per_page;

    const [column, order] = (sort?.split(".") ?? ["createdAt", "desc"]) as [
      keyof SupplyItem | undefined,
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
      db.supplyItem.findMany({
        where,
        take: per_page,
        skip,
        orderBy: {
          [column || "createdAt"]: order || "desc",
        },
        include: {
          department: true,
          category: true,
        },
      }),
      db.supplyItem.count({ where }),
      db.department.findMany(),
    ]);

    const pageCount = Math.ceil(total / per_page);

    const modifiedData = await Promise.all(
      data.map(async (item) => {
        return {
          ...item,
          departmentName: item.department.name,
          categoryName: item.category.name,
        };
      })
    );

    return {
      data: modifiedData,
      pageCount,
      departments: department,
    };
  } catch (err) {
    console.error(err);
    return { data: [], pageCount: 0 };
  }
}

export const createSupplyitem = authedProcedure
  .createServerAction()
  .input(createSupplyItemSchemaServerWithPath)
  .handler(async ({ input, ctx }) => {
    const { path, imageUrl, ...rest } = input;

    try {
      const result = await db.supplyItem.create({
        data: {
          id: generateId(15),
          imageUrl: imageUrl[0],
          ...rest,
        },
      });

      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });

export const updateSupplyItem = authedProcedure
  .createServerAction()
  .input(extendedUpdateSupplyItemSchema)
  .handler(async ({ ctx, input }) => {
    const { path, id, imageUrl, ...rest } = input;
    try {
      await db.supplyItem.update({
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

export const updateSupplyItemStatuses = authedProcedure
  .createServerAction()
  .input(updateSupplyItemItemStatusesSchema)
  .handler(async ({ input }) => {
    const { path, ids, ...rest } = input;
    try {
      await db.supplyItem.updateMany({
        where: {
          id: {
            in: ids,
          },
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

export const deleteSupplyItems = authedProcedure
  .createServerAction()
  .input(deleteSupplyItemsSchema)
  .handler(async ({ input }) => {
    const { path, ...rest } = input;

    try {
      await db.supplyItem.updateMany({
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

  