import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { authMiddleware } from "@/app/lucia-middleware";

async function handler(req: Request) {
  try {
    const inventoryItems = await db.inventoryItem.findMany({
      where: {
        isArchived: false,
        department: {
          isArchived: false,
        },
      },
      include: {
        inventorySubItems: true,
        department: true,
      },
    });

    return NextResponse.json({ data: inventoryItems }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong! try again later" },
      { status: 500 }
    );
  }
}

export const GET = (request: NextRequest) => authMiddleware(request, handler);
