"use client";

import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InventoryItem,
  InventorySubItem,
  ItemStatusSchema,
} from "prisma/generated/zod";
import { formatDate } from "date-fns";
import { Input } from "@/components/ui/input";
import { cn, getReturnableItemStatusIcon, textTransform } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SubItemsTableProps {
  subItems: InventorySubItem[];
  inventoryId: string;
}

export default function SubItemsTable({
  subItems,
  inventoryId,
}: SubItemsTableProps) {
  const [filter, setFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string | null>(null);

  const filteredSubItems = subItems.filter((item) => {
    const matchesFilter =
      item.subName.toLowerCase().includes(filter.toLowerCase()) ||
      (item.serialNumber &&
        item.serialNumber.toLowerCase().includes(filter.toLowerCase()));
    const matchesStatus = !statusFilter || item.status === statusFilter;
    return matchesFilter && matchesStatus;
  });

  return (
    <div className="m-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <Input
            placeholder="Filter by name or serial number"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-sm"
          />
          <Select
            value={statusFilter || "all"}
            onValueChange={(value) =>
              setStatusFilter(value === "all" ? null : value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {ItemStatusSchema.options.map((status) => (
                <SelectItem value={status}>{textTransform(status)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Link
          href={`/admin/inventory-items?page=1&per_page=10&sort=createdAt.desc&id=${inventoryId}`}
          className={cn(buttonVariants({ variant: "link", size: "sm" }))}
        >
          See all
        </Link>
      </div>
      <div className="scroll-bar max-h-64 overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-5">Name</TableHead>
              <TableHead className="px-5">Serial Number</TableHead>
              <TableHead className="px-5">Status</TableHead>
              <TableHead className="px-5">Date Created</TableHead>
              <TableHead className="px-5">Last Modified</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubItems.map((item) => {
              const { icon: Icon, variant } = getReturnableItemStatusIcon(
                item.status
              );
              return (
                <TableRow key={item.id} className="border">
                  <TableCell className="border-r">{item.subName}</TableCell>
                  <TableCell className="border-r">
                    {item.serialNumber || "N/A"}
                  </TableCell>
                  <TableCell className="border-r">
                    <Badge variant={variant}>
                      <Icon className="mr-1 size-4" />
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="border-r">
                    {formatDate(item.createdAt, "PPP p")}
                  </TableCell>
                  <TableCell className="border-r">
                    {formatDate(item.updatedAt, "PPP p")}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
