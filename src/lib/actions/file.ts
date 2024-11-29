"use server";

import { checkAuth } from "../auth/utils";
import { db } from "@/lib/db/index";
import { authedProcedure, convertToBase64, getErrorMessage } from "./utils";
import { revalidatePath } from "next/cache";
import {
  uploadFileSchemaServerWithPath,
  updateVenueRulesSchemaWithPath,
} from "../schema/file";
import { generateId } from "lucia";
import { pusher } from "../pusher";

export const updateDepartmentFile = authedProcedure
  .createServerAction()
  .input(uploadFileSchemaServerWithPath)
  .handler(async ({ input }) => {
    const { path, filePurpose, url, departmentId } = input;

    try {
      await db.file.deleteMany({
        where: {
          filePurpose: filePurpose,
          departmentId: departmentId,
        },
      });

      await db.file.create({
        data: {
          id: generateId(3),
          url: url[0],
          filePurpose: filePurpose,
          departmentId: departmentId,
        },
      });

      await pusher.trigger("request", "request_update", {
        message: "",
      });

      return revalidatePath(path);
    } catch (error) {
      console.log(error);
      return getErrorMessage(error);
    }
  });

export const updateVenueRulesFile = authedProcedure
  .createServerAction()
  .input(updateVenueRulesSchemaWithPath)
  .handler(async ({ input }) => {
    const { path, text, venueId } = input;

    try {
      await db.venue.update({
        where: {
          id: venueId,
        },
        data: {
          rulesAndRegulations: text,
        },
      });

      await pusher.trigger("request", "request_update", {
        message: "",
      });

      return revalidatePath(path);
    } catch (error) {
      console.log(error);
      return getErrorMessage(error);
    }
  });
