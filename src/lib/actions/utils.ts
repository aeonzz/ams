import { createServerActionProcedure } from "zsa";

import { getUserAuth } from "../auth/utils";
import { z } from "zod";

export const authedProcedure = createServerActionProcedure().handler(
  async () => {
    try {
      const { session } = await getUserAuth();

      if (!session) {
        throw new Error("User not authenticated");
      }

      return {
        user: {
          id: session.user.id,
        },
      };
    } catch {
      throw new Error("User not authenticated");
    }
  }
);

export function getErrorMessage(error: unknown) {
  console.log(error);
  const unknownError = "Something went wrong, please try again later.";

  if (error instanceof z.ZodError) {
    const errors = error.issues.map((issue) => {
      throw issue.message;
    });
    throw errors.join("\n");
  } else if (error instanceof Error) {
    throw unknownError;
  } else {
    throw error;
  }
}
