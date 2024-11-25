import * as React from "react";
import {
  ArrowUpIcon,
  CheckCircledIcon,
  Cross2Icon,
  DownloadIcon,
  ReloadIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";

import { exportTableToCSV, exportTableToXLSX } from "@/lib/export";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CommandTooltip from "@/components/ui/command-tooltip";
import { CommandShortcut } from "@/components/ui/command";
import { P } from "@/components/typography/text";
import { usePathname } from "next/navigation";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import { DepartmentVenueRequest } from "./types";

interface VenueRequestTableFloatingBarProps {
  table: Table<DepartmentVenueRequest>;
  fileName: string;
}

export function VenueRequestTableFloatingBar({
  table,
  fileName,
}: VenueRequestTableFloatingBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows;
  const pathname = usePathname();

  const [isLoading, startTransition] = React.useTransition();
  const [method, setMethod] = React.useState<"export">();

  // Clear selection on Escape key press
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        table.toggleAllRowsSelected(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [table]);

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 mx-auto w-fit px-4">
      <div className="w-full overflow-x-auto">
        <div className="mx-auto flex w-fit items-center gap-2 rounded-md border bg-secondary p-2 shadow-2xl">
          <div className="flex h-10 items-center rounded-md border border-dashed bg-tertiary pl-2.5 pr-1">
            <P className="whitespace-nowrap">{rows.length} selected</P>
            <Separator orientation="vertical" className="ml-2 mr-1" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-5 hover:border"
                  onClick={() => table.toggleAllRowsSelected(false)}
                >
                  <Cross2Icon
                    className="size-3.5 shrink-0"
                    aria-hidden="true"
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="flex items-center border bg-accent px-2 py-1 font-semibold text-foreground dark:bg-zinc-900">
                <CommandTooltip text="Clear selection">
                  <CommandShortcut>Esc</CommandShortcut>
                </CommandTooltip>
              </TooltipContent>
            </Tooltip>
          </div>
          <Separator orientation="vertical" className="hidden h-5 sm:block" />
          <div className="flex items-center gap-1.5">
            <Tooltip delayDuration={250}>
              <DropdownMenu>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="size-10 border"
                      disabled={isLoading}
                    >
                      {isLoading && method === "export" ? (
                        <LoadingSpinner />
                      ) : (
                        <DownloadIcon className="size-5" aria-hidden="true" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <DropdownMenuContent align="center">
                  <DropdownMenuItem
                    onClick={() => {
                      setMethod("export");
                      startTransition(() => {
                        exportTableToCSV(table, {
                          filename: fileName,
                          excludeColumns: ["select", "actions"],
                          onlySelected: true,
                        });
                      });
                    }}
                  >
                    Export to CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setMethod("export");
                      startTransition(() => {
                        exportTableToXLSX(table, {
                          filename: fileName,
                          excludeColumns: ["select", "actions"],
                          onlySelected: true,
                        });
                      });
                    }}
                  >
                    Export to Excel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <TooltipContent className="border bg-accent font-semibold text-foreground dark:bg-zinc-900">
                <P>Export {fileName}</P>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}
