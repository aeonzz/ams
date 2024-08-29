import { NextResponse } from "next/server";
import { db } from "@/lib/db/index";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const itemIds = searchParams.get('items')?.split(',') || [];
  const today = new Date();

  try {
    const itemReservations = await db.itemReservation.findMany({
      where: {
        returnableItemId: {
          in: itemIds
        },
        endDate: {
          gte: today,
        },
      },
      include: {
        item: {
          select: {
            id: true,
            name: true,
            status: true,
          }
        },
      },
      orderBy: {
        startDate: 'asc',
      },
    });

    // Restructure the data to group by item
    const groupedReservations = itemIds.reduce((acc, itemId) => {
      acc[itemId] = itemReservations
        .filter(reservation => reservation.returnableItemId === itemId)
        .map(reservation => ({
          id: reservation.id,
          startDate: reservation.startDate,
          endDate: reservation.endDate,
          itemName: reservation.item.name,
          itemStatus: reservation.item.status,
        }));
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json({ data: groupedReservations }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch reserved dates" },
      { status: 500 }
    );
  }
}