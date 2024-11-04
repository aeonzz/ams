import React from "react";

import { P } from "@/components/typography/text";
import { type GetInventoryItemSchema } from "@/lib/schema";
import { DateRangePicker } from "@/components/date-range-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { getInventory } from "@/lib/actions/inventory";
import { InventoryTable } from "./inventory-table";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import AdminSearchInput from "../../../_components/admin-search-input";

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
          <AdminSearchInput />
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
            <InventoryTable inventoryPromise={inventoryPromise} />
          </React.Suspense>
        </div>
      </div>
    </div>
  );
}
