import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/index";

interface Context {
  params: {
    venueId: string;
  };
}

export async function GET(request: NextRequest, params: Context) {
  try {
    const isVenueExist = await db.venue.findUnique({
      where: {
        id: params.params.venueId,
      },
    });

    if (!isVenueExist) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }

    const result = await db.venue.findFirst({
      where: {
        id: params.params.venueId,
        isArchived: false,
      },
      include: {
        department: true,
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
