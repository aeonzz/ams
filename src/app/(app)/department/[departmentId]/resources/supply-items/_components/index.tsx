import React from "react";
import { H3, P } from "@/components/typography/text";
import { CalendarX, PlusIcon, Search } from "lucide-react";
import type { GetInventorySubItemSchema } from "@/lib/schema";
import { getInventorySubItems } from "@/lib/actions/inventoryItem";
import { Skeleton } from "@/components/ui/skeleton";
import { DateRangePicker } from "@/components/date-range-picker";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { getDepartmentSupply } from "@/lib/actions/supply";
import { DepartmentSupplyItemsTable } from "./department-supply-items-table";

interface DepartmentSupplyItemsScreenProps {
  departmentId: string;
  searchParams: GetInventorySubItemSchema;
}

export default function DepartmentSupplyItemsScreen({
  departmentId,
  searchParams,
}: DepartmentSupplyItemsScreenProps) {
  const supplyPromise = getDepartmentSupply({
    ...searchParams,
    departmentId,
  });

  return (
    <div className="w-full">
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
        <DepartmentSupplyItemsTable supplyPromise={supplyPromise} />
      </React.Suspense>
    </div>
  );
}
