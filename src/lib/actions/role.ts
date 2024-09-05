"use server";

import { generateId } from "lucia";
import { authedProcedure, getErrorMessage } from "./utils";

import { db } from "@/lib/db/index";
import { type GetRoleManagementSchema } from "../schema";
import { type RoleWithRelations } from "prisma/generated/zod";
import { roleSchemaWithPath } from "../schema/role";
import { revalidatePath } from "next/cache";

export async function getRoles(input: GetRoleManagementSchema) {
  const { page, per_page, sort, name, from, to } = input;

  try {
    const skip = (page - 1) * per_page;

    const [column, order] = (sort?.split(".") ?? ["createdAt", "desc"]) as [
      keyof RoleWithRelations | undefined,
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
      db.role.findMany({
        where,
        take: per_page,
        skip,
        orderBy: {
          [column || "createdAt"]: order || "desc",
        },
        include: {
          userRoles: {
            include: {
              department: true,
              user: true,
              role: true,
            },
          },
        },
      }),
      db.role.count({ where }),
    ]);
    const pageCount = Math.ceil(total / per_page);

    const modifiedData = await Promise.all(
      data.map(async (data) => {
        const userRolesCount = data.userRoles.length;

        return {
          ...data,
          userRolesCount,
        };
      })
    );

    return { data: modifiedData, pageCount };
  } catch (err) {
    console.error(err);
    return { data: [], pageCount: 0 };
  }
}

export const createRole = authedProcedure
  .createServerAction()
  .input(roleSchemaWithPath)
  .handler(async ({ input, ctx }) => {
    const { path, ...rest } = input;
    try {
      const roleId = generateId(15);
      await db.role.create({
        data: {
          id: roleId,
          ...rest,
        },
      });

      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });
