"use server";

import { z } from "zod";
import { authedProcedure, getErrorMessage } from "./utils";

import { db } from "@/lib/db/index";

export const getItemCategory = authedProcedure
  .createServerAction()
  .input(
    z.object({
      message: z.string(),
    })
  )
  .handler(async () => {
    try {
      const data = await db.itemCategory.findMany();
      return data;
    } catch (error) {
      getErrorMessage(error);
    }
  });
