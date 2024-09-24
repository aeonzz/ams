import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { checkAuth } from "@/lib/auth/utils";

interface Context {
  params: {
    vehicleId: string;
  };
}

export async function GET(request: NextRequest, params: Context) {
  await checkAuth();
  try {
    const isVehicleExist = await db.vehicle.findUnique({
      where: {
        id: params.params.vehicleId,
      },
    });

    if (!isVehicleExist) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    const result = await db.vehicle.findFirst({
      where: {
        id: params.params.vehicleId,
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
