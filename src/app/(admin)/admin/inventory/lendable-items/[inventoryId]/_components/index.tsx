import React from "react";

import { P } from "@/components/typography/text";
import { type GetInventorySubItemSchema } from "@/lib/schema";
import { DateRangePicker } from "@/components/date-range-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { getInventorySubItems } from "@/lib/actions/inventoryItem";
import { InventorySubItemsTable } from "./inventory-sub-items-table";
import LoadingSpinner from "@/components/loaders/loading-spinner";

interface InventorySubItemsScreenProps {
  params: {
    inventoryId: string;
  };
  searchParams: GetInventorySubItemSchema;
}

export default function InventorySubItemsScreen({
  params,
  searchParams,
}: InventorySubItemsScreenProps) {
  const inventorySubItemsPromise = getInventorySubItems({
    ...searchParams,
    inventoryId: params.inventoryId,
  });
  
  return (
    <div className="flex h-full w-full">
      <div className="flex-1">
        <div className="flex h-[50px] items-center justify-between border-b px-3">
          <P className="font-medium">Inventory Items</P>
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
          <React.Suspense
            fallback={
              <DataTableSkeleton
                columnCount={4}
                searchableColumnCount={1}
                filterableColumnCount={2}
                cellWidths={["10rem", "30rem", "12rem", "12rem", "8rem"]}
                shrinkZero
              />
            }
          >
            <InventorySubItemsTable
              inventorySubItemsPromise={inventorySubItemsPromise}
            />
          </React.Suspense>
        </div>
      </div>
    </div>
  );
}
