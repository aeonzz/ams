"use client";

import React from "react";
import { Button } from "../ui/button";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { UserType } from "@/lib/types/user";
import { Row } from "@tanstack/react-table";
import { useHotkeys } from "react-hotkeys-hook";

interface DataTableExpandProps<TData> {
  row: Row<TData>;
}

export default function DataTableExpand<TData>({
  row,
}: DataTableExpandProps<TData>) {
  useHotkeys(
    "esc",
    () => {
      if (row.getIsExpanded()) {
        row.toggleExpanded();
      }
    },
    { enableOnFormTags: true }
  );
  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={() => row.toggleExpanded()}
      aria-label="Toggle row details"
    >
      {row.getIsExpanded() ? (
        <ChevronDownIcon className="h-4 w-4" />
      ) : (
        <ChevronRightIcon className="h-4 w-4" />
      )}
    </Button>
  );
}
