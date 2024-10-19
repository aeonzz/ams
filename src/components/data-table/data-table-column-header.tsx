import React from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
  EyeNoneIcon,
} from "@radix-ui/react-icons";
import { type Column } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { FilterIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { P } from "../typography/text";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  return (
    <div className={cn("flex flex-col space-y-1", className)}>
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="-ml-3 h-8 data-[state=open]:bg-accent"
            >
              <span>{title}</span>
              {column.getCanSort() &&
                (column.getIsSorted() === "desc" ? (
                  <ArrowDownIcon className="ml-2 size-4" aria-hidden="true" />
                ) : column.getIsSorted() === "asc" ? (
                  <ArrowUpIcon className="ml-2 size-4" aria-hidden="true" />
                ) : (
                  <CaretSortIcon className="ml-2 size-4" aria-hidden="true" />
                ))}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {column.getCanSort() && (
              <>
                <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                  <ArrowUpIcon className="mr-2 size-3.5 text-muted-foreground/70" />
                  Asc
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                  <ArrowDownIcon className="mr-2 size-3.5 text-muted-foreground/70" />
                  Desc
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            {column.getCanHide() && (
              <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                <EyeNoneIcon className="mr-2 size-3.5 text-muted-foreground/70" />
                Hide
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* {isFiltering && (
        <Input
          placeholder={`Filter ${title}...`}
          value={(column.getFilterValue() as string) ?? ""}
          onChange={(event) => handleFilterChange(event.target.value)}
          className="h-8 w-full max-w-sm"
        />
      )} */}
    </div>
  );
}
