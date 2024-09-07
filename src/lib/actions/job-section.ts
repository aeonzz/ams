"use server";

import { generateId } from "lucia";
import { authedProcedure, getErrorMessage } from "./utils";

import { db } from "@/lib/db/index";
import { type GetJobSectionSchema } from "../schema";
import { type SectionWithRelations } from "prisma/generated/zod";
import {
  createJobSectionSchemaWithPath,
  deleteJobSectionsSchema,
  updateJobSectionSchemaWithPath,
} from "../schema/job-section";
import { revalidatePath } from "next/cache";

export async function getJobSections(input: GetJobSectionSchema) {
  const { page, per_page, sort, name, from, to } = input;

  try {
    const skip = (page - 1) * per_page;

    const [column, order] = (sort?.split(".") ?? ["createdAt", "desc"]) as [
      keyof SectionWithRelations | undefined,
      "asc" | "desc" | undefined,
    ];

    const where: any = {
      isArchived: false,
    };

    if (name) {
      where.name = { contains: name, mode: "insensitive" };
    }

    if (from && to) {
      where.createdAt = {
        gte: new Date(from),
        lte: new Date(to),
      };
    }

    const [data, total] = await db.$transaction([
      db.section.findMany({
        where,
        take: per_page,
        skip,
        orderBy: {
          [column || "createdAt"]: order || "desc",
        },
      }),
      db.section.count({ where }),
    ]);
    const pageCount = Math.ceil(total / per_page);

    return { data, pageCount };
  } catch (err) {
    console.error(err);
    return { data: [], pageCount: 0 };
  }
}

export const creatJobSection = authedProcedure
  .createServerAction()
  .input(createJobSectionSchemaWithPath)
  .handler(async ({ input, ctx }) => {
    const { path, ...rest } = input;
    try {
      const sectionId = generateId(15);
      await db.section.create({
        data: {
          id: sectionId,
          ...rest,
        },
      });

      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });

export const updateJobSection = authedProcedure
  .createServerAction()
  .input(updateJobSectionSchemaWithPath)
  .handler(async ({ ctx, input }) => {
    const { path, id, ...rest } = input;
    try {
      await db.section.update({
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

export const deleteJobSections = authedProcedure
  .createServerAction()
  .input(deleteJobSectionsSchema)
  .handler(async ({ input }) => {
    const { path, ...rest } = input;

    try {
      await db.section.updateMany({
        where: {
          id: {
            in: rest.ids,
          },
        },
        data: {
          isArchived: true,
        },
      });

      return revalidatePath(path);
    } catch (error) {
      console.log(error);
      getErrorMessage(error);
    }
  });
