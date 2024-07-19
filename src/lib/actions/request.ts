"use server";

import { generateId } from "lucia";
import { RequestSchema } from "../schema/server/request";
import { authedProcedure, getErrorMessage } from "./utils";

import { db } from "@/lib/db/index";
import { revalidatePath } from "next/cache";

export const createRequest = authedProcedure
  .createServerAction()
  .input(RequestSchema)
  .handler(async ({ ctx, input }) => {
    const { user } = ctx;

    const { jobType, path, ...rest } = input;

    if (!jobType) {
      throw "Jobtype is undefined";
    }

    try {
      const requestId = `REQ-${generateId(15)}`;
      const request = await db.request.create({
        data: {
          id: requestId,
          userId: user.id,
          ...rest,
        },
      });

      if (rest.type === "job") {
        const jobRequestId = `JRQ-${generateId(15)}`;
        await db.jobRequest.create({
          data: {
            id: jobRequestId,
            requestId: request.id,
            jobType: jobType,
          },
        });
      }

      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });
