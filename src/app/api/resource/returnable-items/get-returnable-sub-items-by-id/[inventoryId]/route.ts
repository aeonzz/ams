import { NextRequest, NextResponse } from "next/server";
import { withRoles } from "@/middleware/withRole";
import { db } from "@/lib/db/index";
import { redirect } from "next/navigation";
import { checkAuth } from "@/lib/auth/utils";

interface Context {
  params: {
    inventoryId: string;
  };
}

export async function GET(request: NextRequest, params: Context) {
  await checkAuth();
  try {
    const inventoryExist = await db.inventoryItem.findUnique({
      where: {
        id: params.params.inventoryId,
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
        inventoryId: params.params.inventoryId,
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
