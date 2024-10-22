"use client";

import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, getStatusColor, textTransform } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { H3, P } from "@/components/typography/text";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Dot, PlusIcon } from "lucide-react";
import type { SupplyItemCategory } from "prisma/generated/zod";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UseMutateAsyncFunction, useQuery } from "@tanstack/react-query";
import { createCategory } from "@/lib/actions/supply-category";
import { UseFormReturn } from "react-hook-form";
import type {
  CreateSupplyCategory,
  CreateSupplyCategoryWithPath,
} from "@/lib/schema/resource/supply-category";
import axios from "axios";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import CategoriesTableSkeleton from "./categories-table-skeleton";
import FetchDataError from "@/components/card/fetch-data-error";

interface CategoriesTableProps {
  mutateAsync: UseMutateAsyncFunction<
    any,
    Error,
    Parameters<typeof createCategory>[0],
    unknown
  >;
  form: UseFormReturn<CreateSupplyCategory>;
  isPending: boolean;
  className?: string;
}

export default function CategoriesTable({
  className,
  form,
  mutateAsync,
  isPending,
}: CategoriesTableProps) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const { data, isLoading, isError, refetch } = useQuery<SupplyItemCategory[]>({
    queryFn: async () => {
      const res = await axios.get("/api/supply-category");
      return res.data.data;
    },
    queryKey: ["get-supply-categories"],
  });

  const columns: ColumnDef<SupplyItemCategory>[] = React.useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
          return (
            <div className="flex space-x-2">
              <P className="truncate font-medium">{row.original.name}</P>
            </div>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ cell }) => {
          return (
            <P className="text-muted-foreground">
              {format(cell.getValue() as Date, "PP p")}
            </P>
          );
        },
      },
      {
        accessorKey: "updatedAt",
        header: "Last Modified",
        cell: ({ cell }) => {
          return (
            <P className="text-muted-foreground">
              {format(cell.getValue() as Date, "PP p")}
            </P>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  async function handleSubmit(values: any) {
    const payload = { path: pathname, ...values };
    toast.promise(mutateAsync(payload), {
      loading: "Creating...",
      success: () => {
        form.reset();
        refetch();
        setOpen(false);
        return "Category created successfully";
      },
      error: (err) => {
        console.log(err);
        return err.message;
      },
    });
  }

  if (isLoading) return <CategoriesTableSkeleton />;
  if (isError || !data) {
    return <FetchDataError refetch={refetch} />;
  }

  return (
    <div className={cn("rounded-md border p-3", className)}>
      <div className="flex items-center justify-between px-3 py-1">
        <div className="flex space-x-3">
          <Input
            placeholder="Search names..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="h-8 w-40"
          />
        </div>
        <div className="flex items-center gap-1">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="secondary" size="sm">
                <PlusIcon className="mr-2 size-4" aria-hidden="true" />
                Add Category
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <Form {...form}>
                <form
                  autoComplete="off"
                  onSubmit={form.handleSubmit(handleSubmit)}
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="off"
                            placeholder="Office Supplies"
                            disabled={isPending}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="mt-4 flex justify-end">
                    <Button type="submit" disabled={isPending}>
                      {isPending ? "Adding..." : "Add Category"}
                    </Button>
                  </div>
                </form>
              </Form>
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto" size="sm">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="scroll-bar overflow-y-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="bg-transparent px-5">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="px-4 py-2">
        <DataTablePagination
          table={table}
          showSelectedRows={false}
          showRowsPerPage={false}
        />
      </div>
    </div>
  );
}
