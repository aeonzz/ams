import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { authMiddleware } from "@/app/lucia-middleware";

interface Context {
  params: {
    vehicleId: string;
  };
}

async function handler(req: NextRequest, user: any, context: Context) {
  const { params } = context;

  try {
    const isVehicleExist = await db.vehicle.findUnique({
      where: {
        id: params.vehicleId,
      },
    });

    if (!isVehicleExist) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    const result = await db.transportRequest.findMany({
      where: {
        vehicleId: params.vehicleId,
        request: {
          status: {
            in: ["APPROVED", "PENDING", "REVIEWED", "ON_HOLD"],
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        actualStart: true,
        dateAndTimeNeeded: true,
        request: {
          select: {
            id: true,
            title: true,
            status: true,
            createdAt: true,
            completedAt: true,
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
