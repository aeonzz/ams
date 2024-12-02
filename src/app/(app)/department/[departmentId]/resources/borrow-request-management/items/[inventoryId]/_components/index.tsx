import React from "react";
import { H3, P } from "@/components/typography/text";
import { CalendarX, PlusIcon, Search } from "lucide-react";
import type { GetInventorySubItemSchema } from "@/lib/schema";
import { getInventorySubItems } from "@/lib/actions/inventoryItem";
import { Skeleton } from "@/components/ui/skeleton";
import { DateRangePicker } from "@/components/date-range-picker";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { InventorySubItemsTable } from "./inventory-sub-items-table";

interface InventorySubItemsScreenProps {
  params: {
    departmentId: string;
    inventoryId: string;
  };
  searchParams: GetInventorySubItemSchema;
}

export default function InventorySubItemsScreen({
  params,
  searchParams,
}: InventorySubItemsScreenProps) {
  const { departmentId, inventoryId } = params;
  const inventorySubItemsPromise = getInventorySubItems({
    ...searchParams,
    inventoryId,
  });

  return (
    <div className="w-full py-2">
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
          departmentId={departmentId}
          inventoryId={inventoryId}
        />
      </React.Suspense>
    </div>
  );
}
