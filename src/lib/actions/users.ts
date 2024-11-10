"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { generateId } from "lucia";
import { Argon2id } from "oslo/password";
import { createServerAction } from "zsa";
import { readFile } from "fs/promises";
import path from "path";
import { unstable_noStore as noStore } from "next/cache";

import { db } from "@/lib/db/index";

import { lucia, validateRequest } from "../auth/lucia";
import {
  checkAuth,
  genericError,
  getUserAuth,
  setAuthCookie,
  validateAuthFormData,
} from "../auth/utils";
import {
  AuthenticationSchema,
  ChangePasswordSchema,
  ResetPasswordSchema,
} from "../db/schema/auth";
import { ServerUpdateUserSchema } from "../db/schema/user";
import { authedProcedure, getErrorMessage } from "./utils";
import { GetUsersSchema } from "../schema";
import {
  createUserRolesWithPath,
  deleteUsersSchema,
  extendedUserInputSchema,
  updateUserSchemaWithPath,
  updateUsersSchema,
} from "../schema/user";
import { User } from "prisma/generated/zod";
import { removeUserDepartmentSchema } from "@/app/(admin)/admin/users/_components/schema";

interface ActionResult {
  error: string;
}

export const signInAction = createServerAction()
  .input(AuthenticationSchema)
  .timeout(20000)
  .handler(async ({ input }) => {
    try {
      const existingUser = await db.user.findUnique({
        where: { email: input.email.toLowerCase() },
      });

      if (!existingUser) {
        throw "Incorrect email or password";
      }

      const validPassword = await new Argon2id().verify(
        existingUser.hashedPassword,
        input.password
      );

      if (!validPassword) {
        throw "Incorrect email or password";
      }

      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      setAuthCookie(sessionCookie);
    } catch (error) {
      console.log(error);
      getErrorMessage(error);
    }
  });

export async function signUpAction(
  _: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const { data, error } = validateAuthFormData(formData);

  if (error !== null) return { error };

  const hashedPassword = await new Argon2id().hash(data.password);
  const userId = generateId(3);

  try {
    await db.user.create({
      data: {
        id: userId,
        email: data.email,
        firstName: "Christian",
        middleName: "Escol",
        lastName: "Caneos",
        hashedPassword,
      },
    });
  } catch (e) {
    return genericError;
  }

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  setAuthCookie(sessionCookie);
  return redirect("/dashboard");
}

export async function signOutAction(): Promise<ActionResult> {
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  setAuthCookie(sessionCookie);
  redirect("/sign-in");
}

// export const updateUser = authedProcedure
//   .createServerAction()
//   .input(updateUserSchema)
//   .handler(async ({ input, ctx }) => {
//     const { user } = ctx;

//     try {
//       await db.user.update({
//         data: {
//           name: input.name,
//           email: input.email,
//         },
//         where: { id: user.id },
//       });
//       revalidatePath("/account");
//       return { success: true, error: "" };
//     } catch (e) {
//       return genericError;
//     }
//   });

export const resetPassword = createServerAction()
  .input(ChangePasswordSchema)
  .handler(async ({ input }) => {
    const user = await db.user.findUnique({
      where: {
        resetPasswordToken: input.resetPasswordToken,
      },
    });

    if (!user) {
      throw "User not found";
    }

    const resetPasswordTokenExpiry = user.resetPasswordTokenExpiry;

    if (!resetPasswordTokenExpiry) {
      throw "Token expired";
    }

    const hashedPassword = await new Argon2id().hash(input.password);
    try {
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          hashedPassword,
          resetPasswordToken: null,
          resetPasswordTokenExpiry: null,
        },
      });
    } catch (error) {
      getErrorMessage(error);
    }
  });

export const changePassword = authedProcedure
  .createServerAction()
  .input(
    ChangePasswordSchema.omit({
      resetPasswordToken: true,
    })
  )
  .handler(async ({ ctx, input }) => {
    const hashedPassword = await new Argon2id().hash(input.password);
    try {
      await db.user.update({
        where: {
          id: ctx.user.id,
        },
        data: {
          hashedPassword,
          resetPasswordToken: null,
          resetPasswordTokenExpiry: null,
        },
      });
    } catch (error) {
      getErrorMessage(error);
    }
  });

export const currentUser = authedProcedure
  .createServerAction()
  .handler(async ({ ctx }) => {
    const { user } = ctx;

    try {
      const data = await db.user.findUnique({
        where: {
          id: user.id,
        },
        include: {
          setting: true,
          sessions: true,
          userDepartments: {
            include: {
              department: true,
              user: true,
            },
          },
          userRole: {
            include: {
              role: true,
            },
          },
        },
      });

      // if (!data) {
      //   throw "User not found";
      // }

      // let profileImageData = null;
      // if (data.profileUrl) {
      //   const filename = path.basename(data.profileUrl);
      //   const filePath = path.join(uploadPath, filename);
      //   const fileBuffer = await readFile(filePath);
      //   const fileExtension = path.extname(filename).toLowerCase() as
      //     | ".svg"
      //     | ".png"
      //     | ".jpg"
      //     | ".jpeg"
      //     | ".gif";

      //   const mimeTypes: Record<string, string> = {
      //     ".svg": "image/svg+xml",
      //     ".png": "image/png",
      //     ".jpg": "image/jpeg",
      //     ".jpeg": "image/jpeg",
      //     ".gif": "image/gif",
      //   };
      //   const mimeType = mimeTypes[fileExtension] || "application/octet-stream";

      //   const base64 = fileBuffer.toString("base64");
      //   profileImageData = `data:${mimeType};base64,${base64}`;
      // }

      return data;
    } catch (error) {
      getErrorMessage(error);
    }
  });

export async function getUsers(input: GetUsersSchema) {
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
      where.role = { in: role.split(".") };
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

export const removeUserDepartment = authedProcedure
  .createServerAction()
  .input(removeUserDepartmentSchema)
  .handler(async ({ ctx, input }) => {
    const { path, ...rest } = input;
    try {
      await db.userDepartment.delete({
        where: {
          ...rest,
        },
      });
      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });

export const updateUser = authedProcedure
  .createServerAction()
  .input(updateUserSchemaWithPath)
  .handler(async ({ ctx, input }) => {
    const { user } = ctx;
    const { path, email, ...rest } = input;
    const userId = input.id || user.id;
    try {
      const currentUser = await db.user.findUnique({
        where: { id: userId },
        select: { email: true },
      });

      if (!currentUser) {
        throw "User not found";
      }

      const dataToUpdate = {
        ...rest,
        ...(email && email !== currentUser.email ? { email } : {}),
      };

      if (email && email !== currentUser.email) {
        const isEmailTaken = await db.user.findUnique({
          where: { email },
        });

        if (isEmailTaken) {
          throw "Email is already taken";
        }
      }

      await db.user.update({
        where: { id: userId },
        data: dataToUpdate,
      });

      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });

// export const updateUsers = authedProcedure
//   .createServerAction()
//   .input(updateUsersSchema)
//   .handler(async ({ input }) => {
//     const { path, ...rest } = input;
//     try {
//       await db.user.updateMany({
//         where: {
//           id: {
//             in: rest.ids,
//           },
//         },
//         data: {
//           ...(rest.role !== undefined && { role: rest.role }),
//         },
//       });

//       return revalidatePath(path);
//     } catch (error) {
//       getErrorMessage(error);
//     }
//   });

export const createUser = authedProcedure
  .createServerAction()
  .input(extendedUserInputSchema)
  .handler(async ({ input }) => {
    const { confirmPassword, password, path, email, departmentIds, ...rest } =
      input;
    try {
      const existingUser = await db.user.findUnique({
        where: { email: email },
      });

      if (existingUser) {
        throw "Email already exists";
      }

      const userId = generateId(3);
      const hashedPassword = await new Argon2id().hash(password);

      await db.user.create({
        data: {
          id: userId,
          email: email,
          hashedPassword: hashedPassword,
          ...rest,
          userDepartments: {
            createMany: {
              data: departmentIds
                ? departmentIds.map((departmentId) => ({
                    id: generateId(3),
                    departmentId,
                  }))
                : [],
            },
          },
        },
      });

      return revalidatePath(path);
    } catch (error) {
      console.log(error);
      getErrorMessage(error);
    }
  });

export const deleteUsers = authedProcedure
  .createServerAction()
  .input(deleteUsersSchema)
  .handler(async ({ input }) => {
    const { path, ...rest } = input;

    try {
      await db.user.updateMany({
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

export const assignRole = authedProcedure
  .createServerAction()
  .input(createUserRolesWithPath)
  .handler(async ({ ctx, input }) => {
    const { path, userId, roleId, departmentId } = input;

    try {
      const userRoles = roleId.map((role) => ({
        id: generateId(3),
        userId,
        roleId: role,
        departmentId,
      }));

      await db.userRole.createMany({
        data: userRoles,
        skipDuplicates: true,
      });
      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });
