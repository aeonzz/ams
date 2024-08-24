"use server";

import { generateId } from "lucia";
import { authedProcedure, getErrorMessage } from "./utils";

import { db } from "@/lib/db/index";
import { revalidatePath } from "next/cache";
import { RequestTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestTypeSchema";
import { createCohere } from "@ai-sdk/cohere";
import { generateText } from "ai";
import { z } from "zod";
import { GetRequestsSchema } from "../schema";
import { unstable_noStore as noStore } from "next/cache";
import { Request, RequestWithRelations } from "prisma/generated/zod";
import path from "path";
import { readFile } from "fs/promises";
import {
  extendedJobRequestSchema,
  extendedUpdateJobRequestSchema,
} from "../schema/request";

const cohere = createCohere({
  apiKey: process.env.COHERE_API_KEY,
});

export const createRequest = authedProcedure
  .createServerAction()
  .input(extendedJobRequestSchema)
  .handler(async ({ ctx, input }) => {
    const { user } = ctx;

    const { jobType, path, ...rest } = input;

    if (!jobType) {
      throw "Jobtype is undefined";
    }

    try {
      const departments = await db.department.findMany();

      const { text } = await generateText({
        model: cohere("command-r-plus"),
        system: `You are an expert at creating concise, informative titles for work requests. 
                 Your task is to generate clear, action-oriented titles that quickly convey 
                 the nature of the request. Always consider the job type, category, and specific 
                 name of the task when crafting the title. Aim for brevity and clarity. And make it unique for every request. Dont add quotes`,
        prompt: `Create a clear and concise title for a request based on these details:
                 Notes: ${input.notes}

                 
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

      const departmentNames = departments.map((d) => d.name).join(", ");
      const { text: assignedDepartment } = await generateText({
        model: cohere("command-r-plus"),
        system: `You are an AI assistant that assigns departments to job requests based on their description.`,
        prompt: `Given the following job request description, choose the most appropriate department from this list: ${departmentNames}. 
                 Job description: ${input.notes}
                 Job Type: ${jobType}
                 Category: ${rest.category}
                 Name: ${rest.name}
                 
                 Respond with only the name of the chosen department.`,
      });

      const matchedDepartment = departments.find(
        (d) => d.name.toLowerCase() === assignedDepartment.toLowerCase().trim()
      );

      if (!matchedDepartment) {
        throw "couldn't assign a valid department";
      }

      const requestId = `REQ-${generateId(15)}`;

      const request = await db.request.create({
        data: {
          id: requestId,
          userId: user.id,
          priority: rest.priority,
          type: rest.type,
          title: text,
          department: rest.department,
        },
      });

      if (rest.type === ("JOB" satisfies RequestTypeType)) {
        const jobRequestId = `JRQ-${generateId(15)}`;

        const a = await db.jobRequest.create({
          data: {
            id: jobRequestId,
            requestId: request.id,
            notes: rest.notes,
            dueDate: rest.dueDate,
            jobType: jobType,
            category: rest.category,
            name: rest.name,
            assignTo: matchedDepartment.name,
            files: {
              create: rest.files?.map((fileName) => ({
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

export const getPendingReq = authedProcedure
  .createServerAction()
  .input(
    z.object({
      message: z.string().optional(),
    })
  )
  .handler(async ({ ctx }) => {
    const { user } = ctx;

    try {
      const result = await db.request.findMany({
        where: {
          userId: user.id,
          status: "PENDING",
        },
        include: {
          jobRequest: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return result;
    } catch (error) {
      getErrorMessage(error);
    }
  });

export const getUserReqcount = authedProcedure
  .createServerAction()
  .input(
    z.object({
      message: z.string().optional(),
    })
  )
  .handler(async ({ ctx }) => {
    const { user } = ctx;
    try {
      const result = await db.request.count({
        where: {
          userId: user.id,
        },
      });

      return result;
    } catch (error) {
      getErrorMessage(error);
    }
  });

export async function getRequests(input: GetRequestsSchema) {
  const { page, per_page, sort, title, status, priority, from, to } = input;

  try {
    const skip = (page - 1) * per_page;

    const [column, order] = (sort?.split(".") ?? ["createdAt", "desc"]) as [
      keyof Request | undefined,
      "asc" | "desc" | undefined,
    ];

    const where: any = {
      status: { not: "CANCELLED" } 
    };

    if (title) {
      where.title = { contains: title, mode: "insensitive" };
    }

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    if (from && to) {
      where.createdAt = {
        gte: new Date(from),
        lte: new Date(to),
      };
    }

    const [data, total] = await db.$transaction([
      db.request.findMany({
        where,
        take: per_page,
        skip,
        orderBy: {
          [column || "createdAt"]: order || "desc",
        },
      }),
      db.request.count({ where }),
    ]);
    const pageCount = Math.ceil(total / per_page);
    return { data, pageCount };
  } catch (err) {
    console.error(err);
    return { data: [], pageCount: 0 };
  }
}

export async function getCancelledRequests(input: GetRequestsSchema) {
  const { page, per_page, sort, title, status, type, priority, from, to } = input;

  try {
    const skip = (page - 1) * per_page;

    const [column, order] = (sort?.split(".") ?? ["createdAt", "desc"]) as [
      keyof Request | undefined,
      "asc" | "desc" | undefined,
    ];

    const where: any = {
      status: "CANCELLED" 
    };

    if (title) {
      where.title = { contains: title, mode: "insensitive" };
    }

    if (priority) {
      where.priority = priority;
    }
    
    if (type) {
      where.type = type;
    }

    if (from && to) {
      where.createdAt = {
        gte: new Date(from),
        lte: new Date(to),
      };
    }

    const [data, total] = await db.$transaction([
      db.request.findMany({
        where,
        take: per_page,
        skip,
        orderBy: {
          [column || "createdAt"]: order || "desc",
        },
      }),
      db.request.count({ where }),
    ]);
    const pageCount = Math.ceil(total / per_page);
    return { data, pageCount };
  } catch (err) {
    console.error(err);
    return { data: [], pageCount: 0 };
  }
}

export const getRequestById = authedProcedure
  .createServerAction()
  .input(
    z.object({
      id: z.string(),
    })
  )
  .handler(async ({ input }) => {
    const { id } = input;
    try {
      const data = await db.request.findFirst({
        where: {
          id: id,
        },
        include: {
          jobRequest: {
            include: {
              files: true,
            },
          },
          resourceRequest: true,
          venueRequest: true,
        },
      });

      if (!data) {
        throw "Request not found";
      }

      if (data.jobRequest?.files) {
        data.jobRequest.files = await Promise.all(
          data.jobRequest.files.map(async (file) => {
            const filePath = path.join(file.url);
            const fileBuffer = await readFile(filePath);
            const base64String = fileBuffer.toString("base64");
            return {
              ...file,
              url: `data:image/png;base64,${base64String}`,
            };
          })
        );
      }

      return data as RequestWithRelations;
    } catch (error) {
      getErrorMessage(error);
    }
  });

export const updateRequest = authedProcedure
  .createServerAction()
  .input(extendedUpdateJobRequestSchema)
  .handler(async ({ input }) => {
    const { path, id, ...rest } = input;
    try {
      const result = await db.request.update({
        where: {
          id: id,
        },
        data: {
          ...rest,
        },
      });

      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });
