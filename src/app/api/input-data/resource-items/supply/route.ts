import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { authMiddleware } from "@/app/lucia-middleware";

async function handler(req: Request) {
  try {
    const result = await db.$transaction(async (prisma) => {
      const items = await prisma.supplyItem.findMany({
        where: {
          isArchived: false,
          department: {
            isArchived: false,
          },
        },
        include: {
          category: true,
        },
      });
      const departments = await prisma.department.findMany({
        where: {
          isArchived: false,
          managesSupplyRequest: true,
        },
      });

      return { items, departments };
    });

    const { items, departments } = result;

    return NextResponse.json({ data: { items, departments } }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong! try again later" },
      { status: 500 }
    );
  }
}

export const GET = (request: NextRequest) => authMiddleware(request, handler);
