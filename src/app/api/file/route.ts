import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { generateId } from "lucia";

export async function POST(request: NextRequest) {
  try {
    const { files } = await request.json();

    if (!files || !Array.isArray(files) || files.length === 0) {
      return NextResponse.json({ success: false, message: 'No files received' }, { status: 400 });
    }

    const results = await Promise.all(files.map(async (file) => {
      if (!file.content.startsWith('data:image/')) {
        return { name: file.name, success: false, message: 'Not an image file' };
      }

      // Extract the base64 data
      const base64Data = file.content.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');

      // Generate a unique filename
      const filename = `${generateId(10)}-${file.name}`;
      const path = `/tmp/${filename}`;

      // Write the file
      await writeFile(path, buffer);
      console.log(`File saved: ${path}`);

      return { name: file.name, success: true, path };
    }));

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('Error processing files:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}