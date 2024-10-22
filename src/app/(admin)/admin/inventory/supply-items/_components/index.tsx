import React from "react";

import { P } from "@/components/typography/text";
import type { GetSupplyItemSchema } from "@/lib/schema";
import { DateRangePicker } from "@/components/date-range-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { SupplyItemsTable } from "./supply-items-table";
import { getSupply } from "@/lib/actions/supply";
import SupplyMenu from "./supply-menu";
import SearchInput from "@/app/(app)/_components/search-input";

interface SupplyItemsScreenProps {
  params: GetSupplyItemSchema;
}

export default function SupplyItemsScreen({ params }: SupplyItemsScreenProps) {
  const supplyPromise = getSupply(params);

  return (
    <div className="flex h-full w-full">
      <div className="flex-1">
        <div className="flex h-[50px] items-center justify-between border-b px-3">
          <P className="font-medium">Inventory</P>
          <div className="flex gap-2">
            <SupplyMenu />
            <SearchInput />
          </div>
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
            <SupplyItemsTable supplyPromise={supplyPromise} />
          </React.Suspense>
        </div>
      </div>
    </div>
  );
}
