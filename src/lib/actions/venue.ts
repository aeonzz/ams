"use server";

import { checkAuth } from "../auth/utils";

import { db } from "@/lib/db/index";
import { GetVenuesSchema } from "../schema";
import { authedProcedure, convertToBase64, getErrorMessage } from "./utils";
import {
  createVenueSchemaWithPath,
  deleteVenuesSchema,
  extendedUpdateVenueServerSchema,
  updateVenueStatusesSchema,
} from "../schema/venue";
import { revalidatePath } from "next/cache";
import { generateId } from "lucia";
import { Venue } from "prisma/generated/zod";
import placeholder from "public/placeholder.svg";

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
      db.venue.count({ where }),
    ]);
    const pageCount = Math.ceil(total / per_page);

    const dataWithBase64Images = await Promise.all(
      data.map(async (venue) => {
        let imageUrl = venue.imageUrl || placeholder;

        try {
          if (venue.imageUrl) {
            const result = await convertToBase64(venue.imageUrl);
            if ("base64Url" in result) {
              imageUrl = result.base64Url;
            }
          }
        } catch (error) {
          console.error(`Error converting image for venue ${venue.id}:`, error);
          imageUrl = placeholder;
        }
        return {
          ...venue,
          imageUrl: imageUrl,
        };
      })
    );

    return { data: dataWithBase64Images, pageCount };
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

export const updateVenue = authedProcedure
  .createServerAction()
  .input(extendedUpdateVenueServerSchema)
  .handler(async ({ ctx, input }) => {
    const { path, id, imageUrl, ...rest } = input;
    try {
      await db.venue.update({
        where: {
          id: id,
        },
        data: {
          imageUrl: imageUrl && imageUrl[0],
          ...rest,
        },
      });

      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });

export const updateVenueStatuses = authedProcedure
  .createServerAction()
  .input(updateVenueStatusesSchema)
  .handler(async ({ input }) => {
    const { path, ...rest } = input;
    try {
      await db.venue.updateMany({
        where: {
          id: {
            in: rest.ids,
          },
        },
        data: {
          ...(rest.status !== undefined && { status: rest.status }),
        },
      });

      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });

export const deleteVenues = authedProcedure
  .createServerAction()
  .input(deleteVenuesSchema)
  .handler(async ({ input }) => {
    const { path, ...rest } = input;

    try {
      await db.venue.deleteMany({
        where: {
          id: {
            in: rest.ids,
          },
        },
      });

      return revalidatePath(path);
    } catch (error) {
      console.log(error);
      getErrorMessage(error);
    }
  });
