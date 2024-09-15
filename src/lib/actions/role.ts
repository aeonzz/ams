"use server";

import { generateId } from "lucia";
import { authedProcedure, getErrorMessage } from "./utils";

import { db } from "@/lib/db/index";
import { type GetRoleManagementSchema } from "../schema";
import { type RoleWithRelations } from "prisma/generated/zod";
import {
  assignRoleSchema,
  deleteRolesSchema,
  roleSchemaWithPath,
  updateRoleSchemaWithPath,
} from "../schema/role";
import { revalidatePath } from "next/cache";

export async function getRoles(input: GetRoleManagementSchema) {
  const { page, per_page, sort, name, from, to } = input;

  try {
    const skip = (page - 1) * per_page;

    const [column, order] = (sort?.split(".") ?? ["createdAt", "desc"]) as [
      keyof RoleWithRelations | undefined,
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

    return { data, pageCount };
  } catch (err) {
    console.error(err);
    return { data: [], pageCount: 0 };
  }
}

export const createRole = authedProcedure
  .createServerAction()
  .input(roleSchemaWithPath)
  .handler(async ({ input, ctx }) => {
    const { path, name, ...rest } = input;
    const role = name.toUpperCase().replace(/ /g, "_");

    try {
      const existingRole = await db.role.findUnique({
        where: { name: role },
      });

      if (existingRole) {
        throw `Role "${role}" already exists.`;
      }

      const roleId = generateId(15);

      await db.role.create({
        data: {
          id: roleId,
          name: role,
          ...rest,
        },
      });

      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });

export const assignRoles = authedProcedure
  .createServerAction()
  .input(assignRoleSchema)
  .handler(async ({ ctx, input }) => {
    const { users, roleId, path } = input;
    try {
      const departmentIds = Array.from(
        new Set(users.map((user) => user.departmentId))
      );

      const existingDepartments = await db.department.findMany({
        where: { id: { in: departmentIds } },
        select: { id: true },
      });

      const existingDepartmentIds = new Set(
        existingDepartments.map((d) => d.id)
      );

      const validUsers = users.filter((user) =>
        existingDepartmentIds.has(user.departmentId)
      );

      if (validUsers.length !== users.length) {
        console.warn(`Some users were skipped due to invalid department IDs`);
      }

      await db.$transaction(
        validUsers.map(({ id: userId, departmentId }) =>
          db.userRole.upsert({
            where: {
              userId_roleId_departmentId: { userId, roleId, departmentId },
            },
            update: {},
            create: {
              id: generateId(15),
              userId,
              roleId,
              departmentId,
            },
          })
        )
      );

      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });

export const updateRole = authedProcedure
  .createServerAction()
  .input(updateRoleSchemaWithPath)
  .handler(async ({ ctx, input }) => {
    const { path, id, name, ...rest } = input;
    const role = name?.toUpperCase().replace(/ /g, "_");

    try {
      const existingRole = await db.role.findUnique({
        where: { name: role },
      });

      if (existingRole) {
        throw `Role "${role}" already exists.`;
      }

      await db.role.update({
        where: {
          id: id,
        },
        data: {
          name: role,
          ...rest,
        },
      });
      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });

export const deleteRoles = authedProcedure
  .createServerAction()
  .input(deleteRolesSchema)
  .handler(async ({ input }) => {
    const { path, ...rest } = input;

    try {
      await db.role.updateMany({
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

