import { NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { errorMonitor } from "stream";
import { currentUser } from "@/lib/actions/users";
import { checkAuth } from "@/lib/auth/utils";
import placeholder from "public/placeholder.svg";

interface Context {
  params: {
    requestId: string;
  };
}

export async function GET(req: Request, params: Context) {
  const { requestId } = params.params;
  try {
    await checkAuth();
    const [data] = await currentUser();
    const result = await db.request.findFirst({
      where: {
        id: requestId,
        userId: data?.id,
      },
      include: {
        user: true,
        supplyRequest: {
          include: {
            items: {
              include: {
                supplyItem: true,
              },
            },
          },
        },
        jobRequest: {
          include: {
            files: true,
            assignedUser: true,
            reviewer: true,
            section: true,
          },
        },
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
