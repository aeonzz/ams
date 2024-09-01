import React from "react";

import { P } from "@/components/typography/text";
import { type GetInventoryItemSchema } from "@/lib/schema";
import { DateRangePicker } from "@/components/date-range-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { getInventory } from "@/lib/actions/inventory";
import { InventoryTable } from "./inventory-table";
import LoadingSpinner from "@/components/loaders/loading-spinner";

interface InventoryScreenProps {
  params: GetInventoryItemSchema;
}

export default function InventoryScreen({ params }: InventoryScreenProps) {
  const inventoryPromise = getInventory(params);

  return (
    <div className="flex h-full w-full">
      <div className="flex-1">
        <div className="flex h-[50px] items-center justify-between border-b px-3">
          <P className="font-medium">Inventory</P>
          <React.Suspense fallback={<Skeleton className="h-7 w-52" />}>
            <DateRangePicker
              triggerVariant="secondary"
              triggerSize="sm"
              triggerClassName="ml-auto w-56 sm:w-60"
              align="end"
            />
          </React.Suspense>
        </div>
        <div className="grid min-h-[calc(100vh_-_100px)] place-items-center items-center py-3">
          <React.Suspense fallback={<LoadingSpinner />}>
            <InventoryTable inventoryPromise={inventoryPromise} />
          </React.Suspense>
        </div>
      </div>
    </div>
  );
}
