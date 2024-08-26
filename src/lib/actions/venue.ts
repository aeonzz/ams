"use server";

import { checkAuth } from "../auth/utils";

import { db } from "@/lib/db/index";
import { GetVenuesSchema } from "../schema";
import { authedProcedure, getErrorMessage } from "./utils";
import { createVenueSchemaWithPath } from "../schema/venue";
import { revalidatePath } from "next/cache";
import { generateId } from "lucia";
import { Venue } from "prisma/generated/zod";

export async function getVenues(input: GetVenuesSchema) {
  await checkAuth();
  const { page, per_page, sort, name, status, from, to } = input;

  try {
    const skip = (page - 1) * per_page;

    const [column, order] = (sort?.split(".") ?? ["createdAt", "desc"]) as [
      keyof Venue | undefined,
      "asc" | "desc" | undefined,
    ];

    const where: any = {};

    if (name) {
      where.name = { contains: name, mode: "insensitive" };
    }

    if (status) {
      where.status = { in: status.split(".") };
    }

    if (from && to) {
      where.createdAt = {
        gte: new Date(from),
        lte: new Date(to),
      };
    }

    const [data, total] = await db.$transaction([
      db.venue.findMany({
        where,
        take: per_page,
        skip,
        orderBy: {
          [column || "createdAt"]: order || "desc",
        },
      }),
      db.user.count({ where }),
    ]);
    const pageCount = Math.ceil(total / per_page);
    return { data, pageCount };
  } catch (err) {
    console.error(err);
    return { data: [], pageCount: 0 };
  }
}

export const createVenue = authedProcedure
  .createServerAction()
  .input(createVenueSchemaWithPath)
  .handler(async ({ input, ctx }) => {
    const { path, imageUrl, ...rest } = input;
    try {
      const venueId = generateId(15);
      await db.venue.create({
        data: {
          id: venueId,
          imageUrl: imageUrl[0],
          ...rest,
        },
      });

      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });
