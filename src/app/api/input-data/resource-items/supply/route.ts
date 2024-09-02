import { NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { errorMonitor } from "stream";
import { checkAuth } from "@/lib/auth/utils";
import placeholder from "public/placeholder.svg";
import { convertToBase64 } from "@/lib/actions/utils";

export async function GET(req: Request) {
  await checkAuth();
  try {
    const supplyItems = await db.supplyItem.findMany({});

    const dataWithBase64Images = await Promise.all(
      supplyItems.map(async (item) => {
        let imageUrl = item.imageUrl || placeholder;

        try {
          if (item.imageUrl) {
            const result = await convertToBase64(item.imageUrl);
            if ("base64Url" in result) {
              imageUrl = result.base64Url;
            }
          }
        } catch (error) {
          console.error(`Error converting image for item ${item.id}:`, error);
          imageUrl = placeholder;
        }
        return {
          ...item,
          imageUrl: imageUrl,
        };
      })
    );

    return NextResponse.json({ data: dataWithBase64Images }, { status: 200 });
  } catch (error) {
    console.log(errorMonitor);
    return NextResponse.json(
      { error: "Form submission failed" },
      { status: 500 }
    );
  }
}
