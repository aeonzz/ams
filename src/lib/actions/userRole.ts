"use server";

import { generateId } from "lucia";
import { authedProcedure, getErrorMessage } from "./utils";

import { db } from "@/lib/db/index";
import { createSingleUserRoleSchemaWithPath, createUserRoleSchemaWithPath } from "../schema/userRole";
import { revalidatePath } from "next/cache";
import { formatFullName, textTransform } from "../utils";

export const createUserRole = authedProcedure
  .createServerAction()
  .input(createUserRoleSchemaWithPath)
  .handler(async ({ input }) => {
    const { path, userIds, departmentId, roleId } = input;
    try {
      for (const userId of userIds) {
        const existingUserRole = await db.userRole.findUnique({
          where: {
            userId_roleId_departmentId: {
              userId: userId,
              roleId: roleId,
              departmentId: departmentId,
            },
          },
          include: {
            user: {
              select: {
                firstName: true,
                middleName: true,
                lastName: true,
              },
            },
            department: {
              select: {
                name: true,
              },
            },
            role: {
              select: {
                name: true,
              },
            },
          },
        });

        if (existingUserRole) {
          throw `User ${formatFullName(existingUserRole.user.firstName, existingUserRole.user.middleName, existingUserRole.user.lastName)} already has the role ${textTransform(existingUserRole.role.name)} in ${existingUserRole.department.name}.`;
        }

        await db.userRole.create({
          data: {
            id: generateId(15),
            userId: userId,
            roleId: roleId,
            departmentId: departmentId,
          },
        });
      }

      revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });


  export const createMultipleUserRoleUser = authedProcedure
  .createServerAction()
  .input(createSingleUserRoleSchemaWithPath)
  .handler(async ({ input }) => {
    const { path, userId, departmentId, roleIds } = input;
    try {
      for (const roleId of roleIds) {
        const existingUserRole = await db.userRole.findUnique({
          where: {
            userId_roleId_departmentId: {
              userId: userId,
              roleId: roleId,
              departmentId: departmentId,
            },
          },
          include: {
            user: {
              select: {
                firstName: true,
                middleName: true,
                lastName: true,
              },
            },
            department: {
              select: {
                name: true,
              },
            },
            role: {
              select: {
                name: true,
              },
            },
          },
        });

        if (existingUserRole) {
          throw `User ${formatFullName(existingUserRole.user.firstName, existingUserRole.user.middleName, existingUserRole.user.lastName)} already has the role ${textTransform(existingUserRole.role.name)} in ${existingUserRole.department.name}.`;
        }

        await db.userRole.create({
          data: {
            id: generateId(15),
            userId: userId,
            roleId: roleId,
            departmentId: departmentId,
          },
        });
      }

      revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });
