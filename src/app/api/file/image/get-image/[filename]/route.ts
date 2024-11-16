import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  const filename = params.filename;
  const filePath = path.join(process.cwd(), "uploads", "images", filename);

  try {
    const fileBuffer = await readFile(filePath);
    const response = new NextResponse(fileBuffer);

    // Set appropriate content type
    // You might want to determine this based on file extension
    response.headers.set("Content-Type", "image/jpeg");

    return response;
  } catch (error) {
    console.error("Error reading file:", error);
    return NextResponse.json(
      { success: false, message: "File not found" },
      { status: 404 }
    );
  }
}
