import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import { generateId } from "lucia";
import path from "path";
import { withRoles } from "@/middleware/withRole";
import { authMiddleware } from "@/app/lucia-middleware";

async function handler(request: NextRequest) {
  try {
    const uploadPath = path.join(process.cwd(), "uploads", "files");

    // Ensure the upload directory exists
    await mkdir(uploadPath, { recursive: true });

    const { files } = await request.json();

    if (!files || !Array.isArray(files) || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "No files received" },
        { status: 400 }
      );
    }

    const results = await Promise.all(
      files.map(async (file) => {
        if (!file.content.startsWith("data:application/pdf")) {
          return {
            name: file.name,
            success: false,
            message: "Not a PDF file",
          };
        }

        // Extract the base64 data
        const base64Data = file.content.split(",")[1];
        const buffer = Buffer.from(base64Data, "base64");

        // Generate a unique filename
        const filename = `${generateId(3)}-${file.name}`;
        const fullPath = path.join(uploadPath, filename);

        // Write the file
        await writeFile(fullPath, buffer);
        console.log(`File saved: ${fullPath}`);

        return {
          name: file.name,
          success: true,
          filePath: `/api/file/pdf/get-file/${filename}`,
        };
      })
    );

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Error processing files:", error);
    return NextResponse.json(-{ success: false, message: "Server error" }, {
      status: 500,
    });
  }
}

export const POST = (request: NextRequest) => authMiddleware(request, handler);
