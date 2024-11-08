"use client";

import React, { useState } from "react";
import {
  Pencil,
  CheckCircle,
  XCircle,
  EllipsisVertical,
  File,
} from "lucide-react";
import type { DepartmentWithRelations } from "prisma/generated/zod";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { H1, P } from "@/components/typography/text";
import FetchDataError from "@/components/card/fetch-data-error";
import { Button } from "@/components/ui/button";
import { UpdateDepartmentSheet } from "@/app/(admin)/admin/departments/_components/update-department-sheet";
import { useHotkeys } from "react-hotkeys-hook";
import { useDepartmentData } from "@/lib/hooks/use-department-data";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, textTransform } from "@/lib/utils";
import UploadFileDialog from "./upload-file-dialog";
import { FilePurposeType } from "prisma/generated/zod/inputTypeSchemas/FilePurposeSchema";
import { Dialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export interface Capability {
  name: string;
  active: boolean;
  description: string;
  filePurpose: FilePurposeType;
}

interface AboutDepartmentScreenProps {
  departmentId: string;
}

export default function AboutDepartmentScreen({
  departmentId,
}: AboutDepartmentScreenProps) {
  const [showUpdateDepartment, setShowUpdateDepartment] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState<string | null>(null);
  const { data, isLoading, isError, refetch } = useDepartmentData(departmentId);

  useHotkeys(
    "e",
    (event) => {
      event.preventDefault();
      setShowUpdateDepartment(true);
    },
    { enableOnFormTags: false }
  );

  if (isLoading) {
    return <DepartmentSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <FetchDataError refetch={refetch} />
      </div>
    );
  }

  const capabilities: Capability[] = [
    {
      name: "Job Management",
      active: data.acceptsJobs,
      description:
        "Handles job requests and assignments within the department.",
      filePurpose: "JOB_FORM",
    },
    {
      name: "Transport Management",
      active: data.managesTransport,
      description:
        "Coordinates transportation and logistics for the department.",
      filePurpose: "TRANSPORT_FORM",
    },
    {
      name: "Facility Management",
      active: data.managesFacility,
      description:
        "Oversees and maintains department facilities and infrastructure.",
      filePurpose: "VENUE_FORM",
    },
    {
      name: "Supply Management",
      active: data.managesSupplyRequest,
      description: "Manages supply requests and inventory for the department.",
      filePurpose: "NONE",
    },
    {
      name: "Borrow Management",
      active: data.managesBorrowRequest,
      description: "Handles borrowing requests for equipment or resources.",
      filePurpose: "NONE",
    },
  ];

  return (
    <div className="container w-full p-0">
      <div className="space-y-6">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <H1 className="font-semibold tracking-tight">{data.name}</H1>
            <UpdateDepartmentSheet
              open={showUpdateDepartment}
              onOpenChange={setShowUpdateDepartment}
              queryKey={[departmentId]}
              //@ts-ignore
              department={data}
            />
            <Button
              variant="ghost2"
              size="icon"
              onClick={() => setShowUpdateDepartment(true)}
            >
              <Pencil className="size-4" />
            </Button>
          </div>
          <Badge variant="outline">{textTransform(data.departmentType)}</Badge>
          <P className="break-all text-muted-foreground">{data.description}</P>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((capability) => (
            <Card
              key={capability.name}
              className={cn(
                "bg-secondary",
                capability.active ? "border-primary" : ""
              )}
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  {capability.active ? (
                    <CheckCircle className="mr-2 h-5 w-5 text-primary" />
                  ) : (
                    <XCircle className="mr-2 h-5 w-5 text-muted-foreground" />
                  )}
                  {capability.name}
                  {capability.active && capability.filePurpose !== "NONE" && (
                    <Dialog
                      open={openDialog === capability.name}
                      onOpenChange={(isOpen) =>
                        setOpenDialog(isOpen ? capability.name : null)
                      }
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost2"
                            className="ml-auto size-8"
                          >
                            <EllipsisVertical className="size-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            <DropdownMenuItem
                              onSelect={() => setOpenDialog(capability.name)}
                            >
                              <File className="mr-1 size-5" />
                              <span>Request Form</span>
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <UploadFileDialog
                        data={data}
                        capability={capability}
                        departmentId={departmentId}
                        open={openDialog === capability.name}
                        setOpen={(isOpen) =>
                          setOpenDialog(isOpen ? capability.name : null)
                        }
                      />
                    </Dialog>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{capability.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function DepartmentSkeleton() {
  return (
    <div className="flex h-full w-full flex-col p-6">
      <div className="mb-6 flex h-[50px] items-center justify-between border-b px-3">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-10 w-64" />
      </div>
      <div className="space-y-6">
        <div className="rounded-lg border">
          <CardHeader>
            <Skeleton className="mb-2 h-8 w-64" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          </CardContent>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
