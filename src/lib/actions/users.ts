'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { db } from '@/lib/db/index';

import { Argon2id } from 'oslo/password';
import { generateId } from 'lucia';
import { lucia, validateRequest } from '../auth/lucia';
import {
  genericError,
  setAuthCookie,
  validateAuthFormData,
  getUserAuth,
} from '../auth/utils';

import { authedProcedure } from './procedures';
import { updateUserSchema } from '../db/schema/auth';

interface ActionResult {
  error: string;
}

export async function signInAction(
  _: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const { data, error } = validateAuthFormData(formData);
  if (error !== null) return { error };

  try {
    const existingUser = await db.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });
    if (!existingUser) {
      return {
        error: 'Incorrect username or password',
      };
    }

    const validPassword = await new Argon2id().verify(
      existingUser.hashedPassword,
      data.password
    );
    if (!validPassword) {
      return {
        error: 'Incorrect username or password',
      };
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    setAuthCookie(sessionCookie);

    return redirect('/dashboard');
  } catch (e) {
    return genericError;
  }
}

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
        hashedPassword,
      },
    });
  } catch (e) {
    return genericError;
  }

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  setAuthCookie(sessionCookie);
  return redirect('/dashboard');
}

export async function signOutAction(): Promise<ActionResult> {
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: 'Unauthorized',
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  setAuthCookie(sessionCookie);
  redirect('/sign-in');
}

export const updateUser = authedProcedure
  .createServerAction()
  .input(updateUserSchema)
  .handler(async ({ input, ctx }) => {
    const { user } = ctx;

    try {
      await db.user.update({
        data: {
          name: input.name,
          email: input.email,
        },
        where: { id: user.id },
      });
      revalidatePath('/account');
      return { success: true, error: '' };
    } catch (e) {
      return genericError;
    }
  });
