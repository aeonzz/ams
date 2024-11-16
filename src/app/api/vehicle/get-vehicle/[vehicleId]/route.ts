import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { authMiddleware } from "@/app/lucia-middleware";

interface Context {
  params: {
    vehicleId: string;
  };
}

async function handler(req: NextRequest, user: any, context: Context) {
  const { vehicleId } = context.params;
  try {
    const isVehicleExist = await db.vehicle.findUnique({
      where: {
        id: vehicleId,
      },
    });

    if (!isVehicleExist) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    const result = await db.vehicle.findFirst({
      where: {
        id: isVehicleExist.id,
        isArchived: false,
      },
      include: {
        department: true,
        transportRequest: {
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
