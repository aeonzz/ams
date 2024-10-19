"use server";

import { z } from "zod";
import { db } from "@/lib/db/index";
import { GetDepartmentsSchema, GetUsersSchema } from "../schema";
import { checkAuth } from "../auth/utils";
import { authedProcedure, getErrorMessage } from "./utils";
import {
  createDepartmentSchema,
  deleteDepartmentsSchema,
  extendedUpdateDepartmentSchema,
} from "../schema/department";
import { revalidatePath } from "next/cache";
import { generateId } from "lucia";
import { User } from "prisma/generated/zod";

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
          userRole: {
            include: {
              user: true,
              role: true,
            },
          },
        },
      }),
      db.department.count({ where }),
    ]);
    const pageCount = Math.ceil(total / per_page);
    const formattedData = data.map((department) => {
      const { userRole, ...rest } = department;
      return {
        ...rest,
        users: userRole.map((userRole) => {
          return {
            ...userRole.user,
            role: userRole.role.name,
          };
        }),
      };
    });
    return { data: formattedData, pageCount };
  } catch (err) {
    console.error(err);
    return { data: [], pageCount: 0 };
  }
}

export const createDepartment = authedProcedure
  .createServerAction()
  .input(createDepartmentSchema)
  .handler(async ({ input }) => {
    const {
      path,
      maxBorrowDuration,
      gracePeriod,
      penaltyBorrowBanDuration,
      other,
      managesBorrowRequest,
      ...rest
    } = input;

    console.log(rest);

    try {
      const departmentId = generateId(15);

      const departmentBorrowingPolicyData = managesBorrowRequest
        ? {
            create: {
              id: generateId(15),
              maxBorrowDuration: maxBorrowDuration!,
              penaltyBorrowBanDuration: penaltyBorrowBanDuration,
              gracePeriod: gracePeriod!,
              other,
            },
          }
        : undefined;

      await db.department.create({
        data: {
          id: departmentId,
          ...(departmentBorrowingPolicyData && {
            departmentBorrowingPolicy: departmentBorrowingPolicyData,
          }),
          managesBorrowRequest: managesBorrowRequest,
          ...rest,
        },
      });

      return revalidatePath(path);
    } catch (error) {
      console.log(error);
      return getErrorMessage(error);
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

export async function getDepartmentUsers(
  input: GetUsersSchema & { departmentId: string }
) {
  await checkAuth();
  const {
    page,
    per_page,
    sort,
    department,
    email,
    role,
    firstName,
    middleName,
    lastName,
    departmentId,
    from,
    to,
  } = input;

  try {
    const skip = (page - 1) * per_page;

    const [column, order] = (sort?.split(".") ?? ["createdAt", "desc"]) as [
      keyof User | undefined,
      "asc" | "desc" | undefined,
    ];

    const where: any = {
      isArchived: false,
      userDepartments: {
        some: {
          departmentId: departmentId,
        },
      },
    };

    if (email) {
      where.email = { contains: email, mode: "insensitive" };
    }

    if (department) {
      where.department = { contains: department, mode: "insensitive" };
    }

    if (firstName) {
      where.firstName = { contains: firstName, mode: "insensitive" };
    }

    if (middleName) {
      where.firstName = { contains: firstName, mode: "insensitive" };
    }

    if (lastName) {
      where.firstName = { contains: firstName, mode: "insensitive" };
    }

    if (role) {
      where.userRole = {
        some: {
          role: {
            name: { in: role.split(".") },
          },
        },
      };
    }

    if (from && to) {
      where.createdAt = {
        gte: new Date(from),
        lte: new Date(to),
      };
    }

    const [userData, total] = await db.$transaction([
      db.user.findMany({
        where,
        take: per_page,
        skip,
        orderBy: {
          [column || "createdAt"]: order || "desc",
        },
        include: {
          userDepartments: {
            select: {
              id: true,
              department: {
                select: {
                  id: true,
                  name: true,
                },
              },
              user: {
                select: {
                  id: true,
                  firstName: true,
                  middleName: true,
                  lastName: true,
                },
              },
            },
          },
          userRole: {
            where: {
              departmentId: departmentId,
            },
            include: {
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
          },
        },
      }),
      db.user.count({ where }),
    ]);
    const pageCount = Math.ceil(total / per_page);

    const data = userData.map((data) => {
      const { ...rest } = data;
      return {
        ...rest,
      };
    });
    return { data, pageCount };
  } catch (err) {
    console.error(err);
    return { data: [], pageCount: 0 };
  }
}
