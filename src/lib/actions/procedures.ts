import { createServerActionProcedure } from 'zsa';
import { getUserAuth } from '../auth/utils';

export const authedProcedure = createServerActionProcedure().handler(
  async () => {
    try {
      const { session } = await getUserAuth();

      return {
        user: {
          email: session?.user.email,
          id: session?.user.id,
        },
      };
    } catch {
      throw new Error('User not authenticated');
    }
  }
);
