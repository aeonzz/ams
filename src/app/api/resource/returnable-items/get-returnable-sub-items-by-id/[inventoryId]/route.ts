import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { authMiddleware } from "@/app/lucia-middleware";

interface Context {
  params: {
    inventoryId: string;
  };
}

async function handler(req: NextRequest, user: any, context: Context) {
  const { inventoryId } = context.params;
  try {
    const inventoryExist = await db.inventoryItem.findUnique({
      where: {
        id: inventoryId,
      },
    });

    if (!inventoryExist) {
      return NextResponse.json(
        { error: "Inventory not found" },
        { status: 404 }
      );
    }
    const result = await db.inventorySubItem.findMany({
      where: {
        isArchived: false,
        inventoryId: inventoryExist.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        returnableRequest: true,
      },
    });

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong! try again later" },
      { status: 500 }
    );
  }
}

export const GET = (request: NextRequest, context: Context) =>
  authMiddleware(request, handler, context);
