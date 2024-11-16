import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { authMiddleware } from "@/app/lucia-middleware";

interface Context {
  params: {
    venueId: string;
  };
}

async function handler(req: NextRequest, user: any, context: Context) {
  const { venueId } = context.params;
  try {
    const isVenueExist = await db.venue.findUnique({
      where: {
        id: venueId,
      },
    });

    if (!isVenueExist) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }

    const result = await db.venue.findFirst({
      where: {
        id: isVenueExist.id,
        isArchived: false,
      },
      include: {
        department: true,
        venueSetupRequirement: true,
        requests: {
          include: {
            request: true,
          },
        },
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
