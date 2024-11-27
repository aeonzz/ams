"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import {
  cn,
  getRequestTypeIcon,
  getStatusColor,
  textTransform,
} from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

import { P } from "@/components/typography/text";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Dot } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DepartmentJobEvaluation } from "./types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { fillJobRequestEvaluationPDF } from "@/lib/fill-pdf/job-evaluation";
import { toast } from "sonner";

export function getJobEvaluationColumns(): ColumnDef<DepartmentJobEvaluation>[] {
  const surveyColumns = Array.from({ length: 9 }, (_, i) => ({
    accessorKey: `surveyResponses.SQ${i}`,
    header: ({ column }: { column: any }) => (
      <DataTableColumnHeader column={column} title={`SQ${i}`} />
    ),
    cell: ({ row }: { row: any }) => {
      const response = (row.original.surveyResponses as any)?.[`SQ${i}`];
      return (
        <div className="flex space-x-2">
          <P className="truncate font-medium">{textTransform(response)}</P>
        </div>
      );
    },
  }));
  return [
    {
      id: "select",
      header: ({ table }) => (
        <div className="px-3">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="translate-y-0.5"
          />
        </div>
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 20,
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Id" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <P className="truncate font-medium">{row.original.id}</P>
          </div>
        );
      },
    },
    {
      accessorKey: "requestId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Request ID" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <P className="truncate font-medium">{row.original.requestId}</P>
          </div>
        );
      },
    },
    {
      accessorKey: "requestTitle",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Request Title" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex w-[30vw] space-x-2">
            <Link
              href={`/request/${row.original.requestId}`}
              className={cn(
                buttonVariants({ variant: "link" }),
                "p-0 text-foreground"
              )}
              prefetch
            >
              <P className="truncate font-medium">
                {row.original.requestTitle}
              </P>
            </Link>
          </div>
        );
      },
    },
    {
      accessorKey: "clientType",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Client Type" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <P className="truncate font-medium">
              {textTransform(row.original.clientType)}
            </P>
          </div>
        );
      },
    },
    {
      accessorKey: "position",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Position" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <P className="truncate font-medium">{row.original.position}</P>
          </div>
        );
      },
    },
    {
      accessorKey: "sex",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Sex" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <P className="truncate font-medium">{row.original.sex}</P>
          </div>
        );
      },
    },
    {
      accessorKey: "age",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Age" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <P className="truncate font-medium">{row.original.age}</P>
          </div>
        );
      },
    },
    {
      accessorKey: "regionOfResidence",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Region of Residence" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <P className="truncate font-medium">
              {row.original.regionOfResidence}
            </P>
          </div>
        );
      },
    },
    {
      accessorKey: "awarenessLevel",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Awareness Level" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <P className="truncate font-medium">
              {textTransform(row.original.awarenessLevel)}
            </P>
          </div>
        );
      },
    },
    {
      accessorKey: "visibility",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Visibility" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <P className="truncate font-medium">
              {textTransform(row.original.visibility)}
            </P>
          </div>
        );
      },
    },
    {
      accessorKey: "helpfulness",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Helpfulness" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <P className="truncate font-medium">
              {textTransform(row.original.helpfulness)}
            </P>
          </div>
        );
      },
    },
    ...surveyColumns,
    {
      accessorKey: "suggestions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Suggestions" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex w-[30vw] space-x-2">
            <P className="truncate font-medium">{row.original.suggestions}</P>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date Created" />
      ),
      cell: ({ cell }) => {
        return (
          <P className="text-muted-foreground">
            {format(cell.getValue() as Date, "PP")}
          </P>
        );
      },
      size: 0,
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        const { requestTitle, requestId, ...rest } = row.original;
        const handleDownloadEvaluation = async () => {
          const generateAndDownloadPDF = async () => {
            if (rest) {
              try {
                const pdfBlob = await fillJobRequestEvaluationPDF(rest);
                const url = URL.createObjectURL(pdfBlob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `job_request_evaluation_${requestId}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                return "PDF downloaded successfully";
              } catch (error) {
                console.error("Error generating PDF:", error);
                throw new Error("Failed to generate PDF");
              }
            }
          };

          toast.promise(generateAndDownloadPDF(), {
            loading: "Generating PDF...",
            success: (message) => message,
            error: (err) => `Error: ${err.message}`,
          });
        };

        return (
          <div className="grid place-items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="Open menu"
                  variant="ghost"
                  className="flex size-8 p-0 data-[state=open]:bg-muted"
                >
                  <DotsHorizontalIcon className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onSelect={handleDownloadEvaluation}>
                  Download Form
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
      size: 40,
    },
  ];
}
