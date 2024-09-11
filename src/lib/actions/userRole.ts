"use server";

import { generateId } from "lucia";
import { authedProcedure, getErrorMessage } from "./utils";

import { db } from "@/lib/db/index";
import { createUserRoleSchemaWithPath } from "../schema/userRole";

export const createUserRole = authedProcedure
  .createServerAction()
  .input(createUserRoleSchemaWithPath)
  .handler(async ({ input }) => {
    const { path, ...rest } = input;
    try {
      const existingUserRole = await db.userRole.findUnique({
        where: {
          userId_roleId_departmentId: {
            ...rest,
          },
        },
      });

      if (existingUserRole) {
        throw "This user role already exists.";
      }
      await db.userRole.create({
        data: {
          id: generateId(15),
          ...rest,
        },
      });
    } catch (error) {
      getErrorMessage(error);
    }
  });
