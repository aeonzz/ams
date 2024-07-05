import { createServerActionProcedure } from "zsa";

import { getUserAuth } from "../auth/utils";

export const authedProcedure = createServerActionProcedure().handler(async () => {
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
});
