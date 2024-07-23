"use server";

import { generateId } from "lucia";
import { RequestSchema } from "../schema/server/request";
import { authedProcedure, getErrorMessage } from "./utils";

import { db } from "@/lib/db/index";
import { revalidatePath } from "next/cache";
import { RequestTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestTypeSchema";

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
          priority: rest.priority,
          type: rest.type,
          notes: rest.notes,
          department: rest.department,
        },
      });

      if (rest.type === ("JOB" satisfies RequestTypeType)) {
        const jobRequestId = `JRQ-${generateId(15)}`;

        const a = await db.jobRequest.create({
          data: {
            id: jobRequestId,
            requestId: request.id,
            jobType: jobType,
            category: rest.category,
            name: rest.name,
            files: {
              create: rest.files.map((fileName) => ({
                id: `JRQ-${generateId(15)}`,
                url: fileName,
              })),
            },
          },
        });
        console.log(a)
      }

      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });
