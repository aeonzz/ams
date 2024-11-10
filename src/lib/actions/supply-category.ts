"use server";

import { checkAuth } from "../auth/utils";
import { db } from "@/lib/db/index";
import { authedProcedure, convertToBase64, getErrorMessage } from "./utils";
import { createSupplyCategoryWithPath } from "../schema/resource/supply-category";
import { generateId } from "lucia";
import { revalidatePath } from "next/cache";

export const createCategory = authedProcedure
  .createServerAction()
  .input(createSupplyCategoryWithPath)
  .handler(async ({ input, ctx }) => {
    const { path, ...rest } = input;

    try {
      const result = await db.supplyItemCategory.create({
        data: {
          id: generateId(3),
          ...rest,
        },
      });

      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });
