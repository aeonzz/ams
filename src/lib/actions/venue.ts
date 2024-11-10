"use server";

import { checkAuth } from "../auth/utils";

import { db } from "@/lib/db/index";
import { GetVenuesSchema } from "../schema";
import { authedProcedure, convertToBase64, getErrorMessage } from "./utils";
import {
  createVenueSchemaWithPath,
  deleteVenuesSchema,
  extendedUpdateVenueServerSchema,
  updateSetupRequirementSchema,
  updateVenueStatusesSchema,
} from "../schema/venue";
import { revalidatePath } from "next/cache";
import { generateId } from "lucia";
import { Venue } from "prisma/generated/zod";

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
          venueSetupRequirement: true,
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
    const { path, imageUrl, departmenId, setupRequirements, ...rest } = input;
    const { user } = ctx;

    try {
      const result = await db.$transaction(async (prisma) => {
        const createVenue = await prisma.venue.create({
          data: {
            id: generateId(3),
            imageUrl: imageUrl[0],
            departmentId: departmenId,
            ...rest,
          },
        });

        if (setupRequirements && setupRequirements.length > 0) {
          const setupRequirementsData = setupRequirements.map(
            (requirement) => ({
              id: generateId(3),
              venueId: createVenue.id,
              name: requirement,
            })
          );

          await prisma.venueSetupRequirement.createMany({
            data: setupRequirementsData,
          });
        }

        return createVenue;
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
    const { path, id, imageUrl, departmenId, setupRequirements, ...rest } =
      input;

    try {
      const result = await db.$transaction(async (prisma) => {
        const updatedVenue = await prisma.venue.update({
          where: { id },
          data: {
            imageUrl: imageUrl && imageUrl[0],
            departmentId: departmenId,
            ...rest,
          },
        });

        if (setupRequirements !== undefined) {
          const existingRequirements =
            await prisma.venueSetupRequirement.findMany({
              where: { venueId: updatedVenue.id },
            });

          const existingRequirementNames = new Set(
            existingRequirements.map((req) => req.name)
          );

          // Identify requirements to add, update, and delete
          const requirementsToAdd = setupRequirements.filter(
            (req) => !existingRequirementNames.has(req)
          );
          const requirementsToKeep = setupRequirements.filter((req) =>
            existingRequirementNames.has(req)
          );
          const requirementsToDelete = existingRequirements.filter(
            (req) => !setupRequirements.includes(req.name)
          );

          // Add new requirements
          if (requirementsToAdd.length > 0) {
            const newRequirementsData = requirementsToAdd.map(
              (requirement) => ({
                id: generateId(3),
                venueId: updatedVenue.id,
                name: requirement,
              })
            );

            await prisma.venueSetupRequirement.createMany({
              data: newRequirementsData,
            });
          }

          // Update existing requirements if necessary
          for (const requirement of requirementsToKeep) {
            await prisma.venueSetupRequirement.updateMany({
              where: {
                venueId: updatedVenue.id,
                name: requirement,
              },
              data: {
                name: requirement,
              },
            });
          }

          // Delete requirements that are no longer needed
          if (requirementsToDelete.length > 0) {
            await prisma.venueSetupRequirement.deleteMany({
              where: {
                id: {
                  in: requirementsToDelete.map((req) => req.id),
                },
              },
            });
          }
        }

        return updatedVenue;
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
      });

      return revalidatePath(path);
    } catch (error) {
      console.log(error);
      getErrorMessage(error);
    }
  });

export const updateSetupStatus = authedProcedure
  .createServerAction()
  .input(updateSetupRequirementSchema)
  .handler(async ({ ctx, input }) => {
    const { path, id, status } = input;

    try {
      const result = await db.$transaction(async (prisma) => {
        const updatedVenue = await prisma.venueSetupRequirement.update({
          where: {
            id: id,
          },
          data: {
            available: status,
          },
        });

        return updatedVenue;
      });

      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });
