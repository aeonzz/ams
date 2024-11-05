import { NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { checkAuth } from "@/lib/auth/utils";
import { currentUser } from "@/lib/actions/users";

export async function GET(req: Request) {
  try {
    await checkAuth();
    const [data] = await currentUser();

    const result = await db.request.findMany({
      where: {
        userId: data?.id,
      },
      include: {
        jobRequest: true,
        supplyRequest: true,
        returnableRequest: true,
        transportRequest: true,
        venueRequest: true,
      },
      orderBy: {
        createdAt: "asc"
      }
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
