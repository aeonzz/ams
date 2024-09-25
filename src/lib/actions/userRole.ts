"use server";

import { generateId } from "lucia";
import { authedProcedure, getErrorMessage } from "./utils";

import { db } from "@/lib/db/index";
import {
  addUserRoleSchema,
  createSingleUserRoleSchemaWithPath,
  createUserRoleSchemaWithPath,
  removeUserRoleSchema,
} from "../schema/userRole";
import { revalidatePath } from "next/cache";
import { formatFullName, textTransform } from "../utils";

type UserRoleResult = {
  userId: string;
  success: boolean;
  message: string;
};

export const createUserRole = authedProcedure
  .createServerAction()
  .input(createUserRoleSchemaWithPath)
  .handler(async ({ input }) => {
    const { path, userIds, departmentId, roleId } = input;
    const results: UserRoleResult[] = [];

    for (const userId of userIds) {
      try {
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
          results.push({
            userId,
            success: false,
            message: `User ${formatFullName(existingUserRole.user.firstName, existingUserRole.user.middleName, existingUserRole.user.lastName)} already has the role ${textTransform(existingUserRole.role.name)} already`,
          });
        } else {
          await db.userRole.create({
            data: {
              id: generateId(15),
              userId: userId,
              roleId: roleId,
              departmentId: departmentId,
            },
          });

          const user = await db.user.findUnique({
            where: { id: userId },
            select: { firstName: true, middleName: true, lastName: true },
          });

          if (!user) {
            throw "User do not exist";
          }

          results.push({
            userId,
            success: true,
            message: `Role added successfully for ${formatFullName(user?.firstName, user?.middleName, user?.lastName)}.`,
          });
        }
      } catch (error) {
        results.push({
          userId,
          success: false,
          message: `Error adding role for user ${userId}: ${getErrorMessage(error)}`,
        });
      }
    }

    revalidatePath(path);
    return results;
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

      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });

export const removeUserRole = authedProcedure
  .createServerAction()
  .input(removeUserRoleSchema)
  .handler(async ({ input }) => {
    const { path, userRoleId } = input;
    try {
      await db.userRole.delete({
        where: {
          id: userRoleId,
        },
      });
      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });
