"use server";

import { checkAuth } from "../auth/utils";

import { db } from "@/lib/db/index";
import type { GetJobEvaluation } from "../schema";
import type { JobRequestEvaluation } from "prisma/generated/zod";

export async function getDepartmentJobEvaluation(
  input: GetJobEvaluation & { departmentId: string }
) {
  await checkAuth();
  const { page, per_page, sort, from, to, departmentId, requestId } = input;

  try {
    const skip = (page - 1) * per_page;

    const [column, order] = (sort?.split(".") ?? ["createdAt", "desc"]) as [
      keyof JobRequestEvaluation | undefined,
      "asc" | "desc" | undefined,
    ];

    const where: any = {
      jobRequest: {
        request: {
          departmentId: departmentId,
        },
      },
    };

    if (requestId) {
      where.jobRequest.request.id = requestId;
    }

    if (from && to) {
      where.createdAt = {
        gte: new Date(from),
        lte: new Date(to),
      };
    }

    const [data, total, department] = await db.$transaction([
      db.jobRequestEvaluation.findMany({
        where,
        take: per_page,
        skip,
        orderBy: {
          [column || "createdAt"]: order || "desc",
        },
        include: {
          jobRequest: {
            select: {
              request: {
                select: {
                  title: true,
                  id: true,
                },
              },
            },
          },
        },
      }),
      db.jobRequestEvaluation.count({ where }),
      db.department.findUnique({
        where: {
          id: departmentId,
        },
        select: {
          name: true,
        },
      }),
    ]);
    const pageCount = Math.ceil(total / per_page);

    const formattedData = data.map((data) => {
      const { jobRequest, ...rest } = data;
      return {
        ...rest,
        requestId: jobRequest.request.id,
        requestTitle: jobRequest.request.title,
      };
    });

    return { data: formattedData, pageCount, department };
  } catch (err) {
    console.error(err);
    return { data: [], pageCount: 0 };
  }
}
