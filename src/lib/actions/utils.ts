import { createServerActionProcedure } from "zsa";

import { getUserAuth } from "../auth/utils";
import { z } from "zod";
import path from "path";
import { readFile } from "fs/promises";

export const authedProcedure = createServerActionProcedure().handler(
  async () => {
    try {
      const { session } = await getUserAuth();

      if (!session) {
        throw new Error("User not authenticated");
      }

      return {
        user: {
          id: session.user.id,
        },
      };
    } catch {
      throw new Error("User not authenticated");
    }
  }
);

export function getErrorMessage(error: unknown) {
  console.log(error);
  const unknownError = "Something went wrong, please try again later.";

  if (error instanceof z.ZodError) {
    const errors = error.issues.map((issue) => {
      throw issue.message;
    });
    throw errors.join("\n");
  } else if (error instanceof Error) {
    throw unknownError;
  } else {
    throw error;
  }
}

interface ConversionResult {
  originalPath: string;
  base64Url?: string;
  error?: string;
}

export async function convertToBase64(
  input: string | string[]
): Promise<ConversionResult | ConversionResult[]> {
  const convertSingle = async (filePath: string): Promise<ConversionResult> => {
    try {
      const fullPath = path.resolve(filePath);
      const fileBuffer = await readFile(fullPath);
      const base64String = fileBuffer.toString("base64");
      const mimeType =
        path.extname(filePath).toLowerCase() === ".png"
          ? "image/png"
          : "application/octet-stream";
      return {
        originalPath: filePath,
        base64Url: `data:${mimeType};base64,${base64String}`,
      };
    } catch (error) {
      console.error(
        `Error processing file ${filePath}:`,
        (error as Error).message
      );
      return {
        originalPath: filePath,
        error: (error as Error).message,
      };
    }
  };

  if (Array.isArray(input)) {
    return Promise.all(input.map(convertSingle));
  } else if (typeof input === "string") {
    return convertSingle(input);
  } else {
    throw new Error("Input must be a string or an array of strings");
  }
}
