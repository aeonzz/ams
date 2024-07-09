"use server";

import { writeFile } from "fs/promises";
import { getUserAuth } from "../auth/utils";

export async function uploadImage(serializedFiles: Array<{
  name: string;
  type: string;
  size: number;
  lastModified: number;
  content: string;
}>) {
  console.log("fuck")
  // try {
  //   for (const file of files) {
  //     const bytes = await file.arrayBuffer();
  //     const buffer = Buffer.from(bytes);

  //     const path = `/tmp/${file.name}`;
  //     await writeFile(path, buffer);
  //     console.log(`open ${path} to see the uploaded file`);
  //   }

  //   return { success: true, error: null };
  // } catch (error) {
  //   console.log(error);
  //   return { success: null, error: true };
  // }
}
