import React from "react";

import { P } from "@/components/typography/text";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { type GetItemRequestSearchParams } from "@/lib/schema";
import { getRequestByItemId } from "@/lib/actions/inventoryItem";
import { InventorySubItemRequestTable } from "./inventory-sub-item-request-table";

interface InventorySubitemRequestsScreenProps {
  params: {
    departmentId: string;
    inventoryId: string;
    subId: string;
  };
  searchParams: GetItemRequestSearchParams;
}

export default function InventorySubitemRequestsScreen({
  params,
  searchParams,
}: InventorySubitemRequestsScreenProps) {
  const itemRequestPromise = getRequestByItemId({
    ...searchParams,
    itemId: params.subId,
  });

  return (
    <div className="flex h-full w-full">
      <div className="grid h-auto place-items-center items-center py-3">
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
          <InventorySubItemRequestTable
            itemRequestPromise={itemRequestPromise}
          />
        </React.Suspense>
      </div>
    </div>
  );
}
