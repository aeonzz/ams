import React, { useState } from "react";

import { H1, H2, H3, P } from "@/components/typography/text";
import { type GetInventorySchema } from "@/lib/schema";
import { DateRangePicker } from "@/components/date-range-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { getInventoryItems } from "@/lib/actions/inventoryItem";
import { InventoryItemsTable } from "./inventory-items-table";

interface EquipmentDetailsScreenProps {
  params: GetInventorySchema & { id: string };
}

export default function EquipmentDetailsScreen({
  params,
}: EquipmentDetailsScreenProps) {
  const inventoryItemsPromise = getInventoryItems(params);

  return (
    <div className="flex h-full w-full">
      <div className="flex-1">
        <div className="flex h-[50px] items-center justify-between border-b px-3">
          <P className="font-medium">Equipment</P>
          <React.Suspense fallback={<Skeleton className="h-7 w-52" />}>
            <DateRangePicker
              triggerVariant="secondary"
              triggerSize="sm"
              triggerClassName="ml-auto w-56 sm:w-60"
              align="end"
            />
          </React.Suspense>
        </div>
        <div className="grid items-center py-3">
          <React.Suspense
            fallback={
              <DataTableSkeleton
                columnCount={5}
                searchableColumnCount={1}
                filterableColumnCount={2}
                cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
                shrinkZero
              />
            }
          >
            <InventoryItemsTable
              inventoryItemsPromise={inventoryItemsPromise}
            />
          </React.Suspense>
        </div>
      </div>
    </div>
  );
}
