import { NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { checkAuth } from "@/lib/auth/utils";

export async function GET(req: Request) {
  await checkAuth();
  try {
    const result = await db.$transaction(async (prisma) => {
      const items = await prisma.supplyItem.findMany({
        where: {
          isArchived: false,
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

    // const dataWithBase64Images = await Promise.all(
    //   supplyItems.map(async (item) => {
    //     let imageUrl = item.imageUrl || placeholder;

    //     try {
    //       if (item.imageUrl) {
    //         const result = await convertToBase64(item.imageUrl);
    //         if ("base64Url" in result) {
    //           imageUrl = result.base64Url;
    //         }
    //       }
    //     } catch (error) {
    //       console.error(`Error converting image for item ${item.id}:`, error);
    //       imageUrl = placeholder;
    //     }
    //     return {
    //       ...item,
    //       imageUrl: imageUrl,
    //     };
    //   })
    // );

    return NextResponse.json({ data: { items, departments } }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong! try again later" },
      { status: 500 }
    );
  }
}
