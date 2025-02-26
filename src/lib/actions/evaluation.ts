"use server";

import { generateId } from "lucia";
import { authedProcedure, getErrorMessage } from "./utils";

import { db } from "@/lib/db/index";
import { revalidatePath } from "next/cache";
import { createJobEvaluationSchemaWithPath } from "../schema/evaluation/job";
import { pusher } from "../pusher";

export const createJobRequestEvaluation = authedProcedure
  .createServerAction()
  .input(createJobEvaluationSchemaWithPath)
  .handler(async ({ input, ctx }) => {
    const { path, surveyResponses, position, otherPosition, ...rest } = input;
    try {
      await db.jobRequestEvaluation.create({
        data: {
          id: generateId(3),
          surveyResponses: surveyResponses,
          position:
            position === "Others" && otherPosition ? otherPosition : position,
          ...rest,
        },
      });

      await pusher.trigger("request", "request_update", {
        message: "",
      });

      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });
