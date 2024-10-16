import { NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { currentUser } from "@/lib/actions/users";
import { checkAuth } from "@/lib/auth/utils";

export async function GET(req: Request) {
  // await checkAuth();
  const [data] = await currentUser();
  try {
    const result = await db.request.findMany({
      where: {
        userId: data?.id,
      },
      include: {
        user: true,
        returnableRequest: {
          include: {
            item: {
              include: {
                inventory: {
                  include: {
                    inventorySubItems: true,
                  },
                },
              },
            },
          },
        },
        transportRequest: {
          include: {
            vehicle: true,
          },
        },
        venueRequest: {
          include: {
            venue: true,
          },
        },
      },
    });

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch reserved dates" },
      { status: 500 }
    );
  }
}
