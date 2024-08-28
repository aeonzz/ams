'use server'

import { generateText } from "ai";
import { authedProcedure, getErrorMessage } from "./utils";
import { db } from "@/lib/db/index";
import { cohere } from "@ai-sdk/cohere";
import { generateId } from "lucia";
import { revalidatePath } from "next/cache";


export const createReturnableResourceRequest = authedProcedure
  .createServerAction()
  .input(extendedResourceRequestSchema)
  .handler(async ({ ctx, input }) => {
    const { user } = ctx;

    const { path, ...rest } = input;

    try {
      const { text } = await generateText({
        model: cohere("command-r-plus"),
        system: `You are an expert at creating concise, informative titles for work requests. 
                 Your task is to generate clear, action-oriented titles that quickly convey 
                 the nature of the request. Always consider the job type, category, and specific 
                 name of the task when crafting the title. Aim for brevity and clarity. And make it unique for every request. Dont add quotes`,
        prompt: `Create a clear and concise title for a request based on these details:
                 Notes: 
                 ${input.type} request
                 ${input.notes}
                 ${rest.purpose.join(", ")}

                 
                 Guidelines:
                 1. Keep it under 50 characters
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
      const resourceRequestId = `RRQ-${generateId(15)}`;

      await db.request.create({
        data: {
          id: requestId,
          userId: user.id,
          priority: rest.priority,
          type: rest.type,
          title: text,
          department: rest.department,
          resourceRequest: {
            create: {
              id: resourceRequestId,
              startTime: rest.startTime,
              endTime: rest.endTime,
              purpose: rest.purpose.includes("other")
                ? [
                    ...rest.purpose.filter((p) => p !== "other"),
                    rest.otherPurpose,
                  ].join(", ")
                : rest.purpose.join(", "),
              setupRequirements: rest.setupRequirements.includes("other")
                ? [
                    ...rest.setupRequirements.filter((s) => s !== "other"),
                    rest.otherSetupRequirement,
                  ].join(", ")
                : rest.setupRequirements.join(", "),
              notes: rest.notes,
              resourceId: rest.resourceId,
            },
          },
        },
      });

      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });