"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { generateId } from "lucia";
import { Argon2id } from "oslo/password";
import { createServerAction } from "zsa";

import { db } from "@/lib/db/index";

import { lucia, validateRequest } from "../auth/lucia";
import {
  genericError,
  getUserAuth,
  setAuthCookie,
  validateAuthFormData,
} from "../auth/utils";
import getBase64 from "../base64";
import {
  authenticationSchema,
  changePasswordSchema,
  resetPasswordSchema,
} from "../db/schema/auth";
import { serverUpdateUserSchema } from "../db/schema/user";
import { authedProcedure, getErrorMessage } from "./utils";

interface ActionResult {
  error: string;
}

export const signInAction = createServerAction()
  .input(authenticationSchema)
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
  const userId = generateId(15);

  try {
    await db.user.create({
      data: {
        id: userId,
        email: data.email,
        username: "test",
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
  .input(changePasswordSchema)
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
          files: true,
        },
      });

      return data;
    } catch (error) {
      getErrorMessage(error);
    }
  });

export const updateUser = authedProcedure
  .createServerAction()
  .input(serverUpdateUserSchema)
  .handler(async ({ ctx, input }) => {
    const { user } = ctx;
    const { path, ...rest } = input;
    try {
      await db.user.update({
        where: {
          id: user.id,
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

  