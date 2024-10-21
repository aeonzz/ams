"use client";

import NotFound from "@/app/not-found";
import FetchDataError from "@/components/card/fetch-data-error";
import { H3, H4, P } from "@/components/typography/text";
import { useDialogManager } from "@/lib/hooks/use-dialog-manager";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CalendarX, Dot, ExternalLink, PlusIcon, Search } from "lucide-react";
import type { InventoryItemWithRelations } from "prisma/generated/zod";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SearchInput from "@/app/(app)/_components/search-input";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn, getReturnableItemStatusIcon, textTransform } from "@/lib/utils";

interface DepartmentBorrowableItemsScreen {
  departmentId: string;
}

const NoDataMessage = ({ message }: { message: string }) => (
  <div className="flex min-h-[calc(100vh_-_200px)] flex-col items-center justify-center space-y-2 p-8 text-center">
    <CalendarX className="size-16" strokeWidth={1} />
    <P className="text-muted-foreground">{message}</P>
  </div>
);

export default function DepartmentBorrowableItemsScreen({
  departmentId,
}: DepartmentBorrowableItemsScreen) {
  const dialogManager = useDialogManager();
  const [searchTerm, setSearchTerm] = React.useState("");

  const { data, isLoading, refetch, isError, error } = useQuery<
    InventoryItemWithRelations[]
  >({
    queryFn: async () => {
      const res = await axios.get(
        `/api/resource/returnable-items/get-returnable-items/${departmentId}`
      );
      return res.data.data;
    },
    queryKey: ["department-returnable-items", departmentId],
  });

  const filteredItems =
    data?.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  if (isError && axios.isAxiosError(error) && error.response?.status === 404) {
    return <NotFound />;
  }

  return (
    <div className="container flex-col space-y-2 p-0">
      <div className="flex w-full justify-between pb-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search items..."
            className="h-8 w-[280px] pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          variant="default"
          size="sm"
          onClick={() =>
            dialogManager.setActiveDialog("adminCreateInventoryItemDialog")
          }
          className="h-8"
        >
          <PlusIcon className="mr-1 size-4" aria-hidden="true" />
          <P className="font-semibold">Add</P>
        </Button>
      </div>
      <div className="scroll-bar flex flex-1 justify-center overflow-y-auto">
        {isLoading ? (
          <div>...Loading</div>
        ) : isError ? (
          <div className="flex h-screen w-full items-center justify-center">
            <FetchDataError refetch={refetch} />
          </div>
        ) : data?.length === 0 ? (
          <NoDataMessage message="No items available." />
        ) : (
          <>
            {filteredItems.length === 0 ? (
              <NoDataMessage message="No items found. Try adjusting your search" />
            ) : (
              <div className="grid w-full grid-cols-3 gap-3 pb-3">
                {filteredItems.map((item) => {
                  return (
                    <Link
                      key={item.id}
                      href={`/department/${departmentId}/transport/${item.id}`}
                      className="flex h-auto w-full justify-between gap-3 overflow-hidden rounded-md p-3 transition-colors hover:bg-secondary-accent hover:text-secondary-accent-foreground"
                    >
                      <div className="relative aspect-square min-w-24 rounded-md">
                        <Image
                          src={item.imageUrl}
                          alt={`Image of ${item.name}`}
                          fill
                          priority
                          className="rounded-md object-cover"
                        />
                      </div>
                      <div className="flex h-full w-full flex-col justify-between overflow-hidden">
                        <div>
                          <H3 className="w-full truncate font-semibold tracking-tight">
                            {item.name}
                          </H3>
                          <P className="h-auto w-full break-all text-xs font-normal leading-none text-muted-foreground">
                            {item.description.length > 100
                              ? `${item.description.slice(0, 100)}...`
                              : item.description}
                          </P>
                        </div>
                        <span className="ml-auto mt-auto text-xs text-muted-foreground">
                          {item.inventorySubItems.length} items
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

{
  /* <Link
                          href={`/department/${departmentId}/transport/${item.id}`}
                          className={cn(
                            buttonVariants({
                              variant: "ghost2",
                              size: "icon",
                            })
                          )}
                          prefetch
                        >
                          <ExternalLink className="size-5" />
                        </Link> */
}
