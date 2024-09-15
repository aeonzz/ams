"use server";

import { z } from "zod";
import { db } from "@/lib/db/index";
import { GetDepartmentsSchema } from "../schema";
import { checkAuth } from "../auth/utils";
import { authedProcedure, getErrorMessage } from "./utils";
import {
  deleteDepartmentsSchema,
  extendedCreateDepartmentSchema,
  extendedUpdateDepartmentSchema,
} from "../schema/department";
import { revalidatePath } from "next/cache";
import { generateId } from "lucia";

export async function getDepartments(input: GetDepartmentsSchema) {
  await checkAuth();
  const { page, per_page, sort, name, from, to } = input;

  try {
    const skip = (page - 1) * per_page;

    const [column, order] = (sort?.split(".") ?? ["createdAt", "desc"]) as [
      keyof Request | undefined,
      "asc" | "desc" | undefined,
    ];

    const where: any = {
      isArchived: false,
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
      db.department.findMany({
        where,
        take: per_page,
        skip,
        orderBy: {
          [column || "createdAt"]: order || "desc",
        },
        include: {
          user: true,
        },
      }),
      db.department.count({ where }),
    ]);
    const pageCount = Math.ceil(total / per_page);
    return { data, pageCount };
  } catch (err) {
    console.error(err);
    return { data: [], pageCount: 0 };
  }
}

export const createDepartment = authedProcedure
  .createServerAction()
  .input(extendedCreateDepartmentSchema)
  .handler(async ({ input }) => {
    const { path, ...rest } = input;
    try {
      const departmentId = generateId(15);

      await db.department.create({
        data: {
          id: departmentId,
          ...rest,
        },
      });

      return revalidatePath(path);
    } catch (error) {
      console.log(error);
      getErrorMessage(error);
    }
  });

export const updateDepartment = authedProcedure
  .createServerAction()
  .input(extendedUpdateDepartmentSchema)
  .handler(async ({ ctx, input }) => {
    const { path, id, ...rest } = input;
    try {
      await db.department.update({
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

export const deleteDepartments = authedProcedure
  .createServerAction()
  .input(deleteDepartmentsSchema)
  .handler(async ({ input }) => {
    const { path, ...rest } = input;

    try {
      await db.department.updateMany({
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
