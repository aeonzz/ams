"use server";

import { generateId } from "lucia";
import { RequestSchema } from "../schema/server/request";
import { authedProcedure, getErrorMessage } from "./utils";

import { db } from "@/lib/db/index";
import { revalidatePath } from "next/cache";
import { RequestTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestTypeSchema";
import { createCohere } from "@ai-sdk/cohere";
import { generateText } from "ai";

const cohere = createCohere({
  apiKey: process.env.COHERE_API_KEY,
});

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
      const { text } = await generateText({
        model: cohere("command-r-plus"),
        system: `You are an expert at creating concise, informative titles for work requests. 
                 Your task is to generate clear, action-oriented titles that quickly convey 
                 the nature of the request. Always consider the job type, category, and specific 
                 name of the task when crafting the title. Aim for brevity and clarity. Remove the quotes`,
        prompt: `Create a clear and concise title for a request based on these details:
                 Notes: ${input.notes}
                 Job Type: ${input.jobType}
                 Category: ${input.category}
                 Name: ${input.name}
                 
                 Guidelines:
                 1. Keep it under 20 characters
                 2. Include the job type, category, and name in the title
                 3. Capture the main purpose of the request
                 4. Use action-oriented language
                 5. Be specific to the request's context
                 6. Make it easy to understand at a glance
                 7. Use title case
                 
                 Example: 
                 If given:
                 Notes: Fix leaking faucet in the main office bathroom
                 Job Type: Maintenance
                 Category: Building
                 Name: Plumbing
                 
                 A good title might be:
                 "Urgent Plumbing Maintenance: Office Bathroom Faucet Repair"
                 
                 Now, create a title for the request using the provided details above.`,
      });

      const requestId = `REQ-${generateId(15)}`;

      const request = await db.request.create({
        data: {
          id: requestId,
          userId: user.id,
          priority: rest.priority,
          type: rest.type,
          title: text,
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
      }

      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });
