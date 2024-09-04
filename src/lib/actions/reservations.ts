"use server"

import { generateId } from "lucia";
import { authedProcedure, getErrorMessage } from "./utils";

import { db } from "@/lib/db/index";
import { GetReservationsSchema } from "../schema";
import { RequestWithRelations } from "prisma/generated/zod";

export async function getReservations(input: GetReservationsSchema) {
  const { page, per_page, sort, title, status, type, priority, from, to } =
    input;

  try {
    const skip = (page - 1) * per_page;

    const [column, order] = (sort?.split(".") ?? ["createdAt", "desc"]) as [
      keyof RequestWithRelations | undefined,
      "asc" | "desc" | undefined,
    ];

    const where: any = {
      status: { not: "CANCELLED" },
    };

    if (title) {
      where.title = { contains: title, mode: "insensitive" };
    }

    if (status) {
      where.status = status;
    }

    if (type) {
      where.type = { in: type.split(".") };
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