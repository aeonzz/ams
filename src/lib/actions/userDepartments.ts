"use server";

import { generateId } from "lucia";
import { authedProcedure, getErrorMessage } from "./utils";

import { db } from "@/lib/db/index";
import { revalidatePath } from "next/cache";
import { addUserDepartmentsSchemaWithPath } from "@/app/(admin)/admin/users/_components/schema";

export const createUserDepartments = authedProcedure
  .createServerAction()
  .input(addUserDepartmentsSchemaWithPath)
  .handler(async ({ input }) => {
    const { path, userId, departmentIds } = input;

    try {
      for (const departmentId of departmentIds) {
        const existingUserDepartment = await db.userDepartment.findUnique({
          where: {
            userId_departmentId: {
              userId: userId,
              departmentId: departmentId,
            },
          },
          include: {
            department: true,
          },
        });

        if (existingUserDepartment) {
          throw `This user is already in the department ${existingUserDepartment.department.name}`;
        }

        await db.userDepartment.create({
          data: {
            id: generateId(3),
            userId: userId,
            departmentId: departmentId,
          },
        });
      }

      revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });
