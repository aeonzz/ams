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
import { updateRequestStatusSchemaWithPath } from "@/app/(app)/(params)/request/[requestId]/_components/schema";

export async function getVenues(input: GetVenuesSchema) {
  await checkAuth();
  const { page, per_page, sort, name, status, venueType, from, to } = input;

  try {
    const skip = (page - 1) * per_page;

    const [column, order] = (sort?.split(".") ?? ["createdAt", "desc"]) as [
      keyof Venue | undefined,
      "asc" | "desc" | undefined,
    ];

    const where: any = {
      isArchived: false,
    };

    if (name) {
      where.name = { contains: name, mode: "insensitive" };
    }

    if (status) {
      where.status = { in: status.split(".") };
    }

    if (venueType) {
      where.venueType = { in: venueType.split(".") };
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
        include: {
          department: true,
        },
      }),
      db.venue.count({ where }),
    ]);
    const pageCount = Math.ceil(total / per_page);

    const formattedData = data.map((venue) => {
      return {
        ...venue,
        departmentName: venue.department.name,
      };
    });

    return { data: formattedData, pageCount };
  } catch (err) {
    console.error(err);
    return { data: [], pageCount: 0 };
  }
}

export const createVenue = authedProcedure
  .createServerAction()
  .input(createVenueSchemaWithPath)
  .handler(async ({ input, ctx }) => {
    const { path, imageUrl, departmenId, features, ...rest } = input;
    const { user } = ctx;

    try {
      const result = await db.$transaction(async (prisma) => {
        const venueId = generateId(15);

        const featuresWithIds = features?.map((feature) => ({
          id: generateId(15),
          name: feature,
        }));

        const createVenue = await prisma.venue.create({
          data: {
            id: venueId,
            imageUrl: imageUrl[0],
            departmentId: departmenId,
            features: featuresWithIds,
            ...rest,
          },
        });

        const newValueJson = JSON.parse(JSON.stringify(createVenue));
        await prisma.genericAuditLog.create({
          data: {
            id: generateId(15),
            entityId: createVenue.id,
            entityType: "VENUE",
            changeType: "CREATED",
            newValue: newValueJson,
            changedById: user.id,
          },
        });
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
    const { user } = ctx;
    const { path, id, imageUrl, departmentId, features, changeType, ...rest } =
      input;

    try {
      const result = await db.$transaction(async (prisma) => {
        const featuresWithIds = features?.map((feature) => ({
          id: generateId(15),
          name: feature,
        }));

        const currentVenue = await prisma.venue.findUnique({
          where: { id },
        });

        if (!currentVenue) {
          throw "Venue not found";
        }

        const updateVenue = await prisma.venue.update({
          where: {
            id: id,
          },
          data: {
            imageUrl: imageUrl && imageUrl[0],
            departmentId: departmentId,
            features: featuresWithIds,
            ...rest,
          },
        });

        const oldValueJson = JSON.parse(JSON.stringify(currentVenue));
        const newValueJson = JSON.parse(JSON.stringify(updateVenue));

        await prisma.genericAuditLog.create({
          data: {
            id: generateId(15),
            entityId: updateVenue.id,
            changeType: changeType,
            entityType: "VENUE",
            oldValue: oldValueJson,
            newValue: newValueJson,
            changedById: user.id,
          },
        });
      });

      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });

export const updateVenueStatuses = authedProcedure
  .createServerAction()
  .input(updateVenueStatusesSchema)
  .handler(async ({ input, ctx }) => {
    const { user } = ctx;
    const { path, ids, ...rest } = input;
    try {
      const result = await db.$transaction(async (prisma) => {
        const currentVenues = await prisma.venue.findMany({
          where: { id: { in: ids } },
        });

        if (!currentVenues || currentVenues.length === 0) {
          throw "Venue not found";
        }

        await prisma.venue.updateMany({
          where: {
            id: {
              in: ids,
            },
          },
          data: {
            ...(rest.status !== undefined && { status: rest.status }),
          },
        });

        const updatedVenues = await prisma.venue.findMany({
          where: { id: { in: ids } },
        });

        for (let i = 0; i < ids.length; i++) {
          const oldValueJson = JSON.stringify(currentVenues[i]);
          const newValueJson = JSON.stringify(updatedVenues[i]);

          await prisma.genericAuditLog.create({
            data: {
              id: generateId(15),
              entityId: updatedVenues[i].id,
              changeType: "STATUS_CHANGE",
              entityType: "VENUE",
              oldValue: oldValueJson,
              newValue: newValueJson,
              changedById: user.id,
            },
          });
        }
      });

      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });

export const deleteVenues = authedProcedure
  .createServerAction()
  .input(deleteVenuesSchema)
  .handler(async ({ input, ctx }) => {
    const { user } = ctx;
    const { path, ids } = input;

    try {
      const result = await db.$transaction(async (prisma) => {
        const currentVenues = await prisma.venue.findMany({
          where: { id: { in: ids } },
        });

        if (!currentVenues || currentVenues.length === 0) {
          throw "Venue not found";
        }

        await prisma.venue.updateMany({
          where: {
            id: {
              in: ids,
            },
          },
          data: {
            isArchived: true,
          },
        });

        const updatedVenues = await prisma.venue.findMany({
          where: { id: { in: ids } },
        });

        for (let i = 0; i < ids.length; i++) {
          const oldValueJson = JSON.stringify(currentVenues[i]);
          const newValueJson = JSON.stringify(updatedVenues[i]);

          await prisma.genericAuditLog.create({
            data: {
              id: generateId(15),
              entityId: updatedVenues[i].id,
              changeType: "ARCHIVED",
              entityType: "VENUE",
              oldValue: oldValueJson,
              newValue: newValueJson,
              changedById: user.id,
            },
          });
        }
      });

      return revalidatePath(path);
    } catch (error) {
      console.log(error);
      getErrorMessage(error);
    }
  });

export const updateVenueRequestStatus = authedProcedure
  .createServerAction()
  .input(updateRequestStatusSchemaWithPath)
  .handler(async ({ ctx, input }) => {
    const { user } = ctx;
    const { path, requestId, reviewerId, changeType, ...rest } = input;

    try {
      const result = await db.$transaction(async (prisma) => {
        const currentVenueRequest = await prisma.venueRequest.findUnique({
          where: {
            requestId: requestId,
          },
        });

        if (!currentVenueRequest) {
          throw "VenueRequest or Request not found";
        }

        const updatedRequest = await prisma.request.update({
          where: { id: requestId },
          data: {
            ...rest,
            venueRequest: {
              update: {
                reviewedBy: reviewerId,
              },
            },
          },
          include: { venueRequest: true },
        });
        const oldValueJson = JSON.parse(JSON.stringify(currentVenueRequest));
        const newValueJson = JSON.parse(
          JSON.stringify(updatedRequest.venueRequest)
        );
        await prisma.genericAuditLog.create({
          data: {
            id: generateId(15),
            entityId: currentVenueRequest.id,
            entityType: "VENUE_REQUEST",
            changeType: changeType,
            oldValue: oldValueJson,
            newValue: newValueJson,
            changedById: user.id,
          },
        });

        return updatedRequest;
      });

      return revalidatePath(path);
    } catch (error) {
      console.log(error);
      getErrorMessage(error);
    }
  });
