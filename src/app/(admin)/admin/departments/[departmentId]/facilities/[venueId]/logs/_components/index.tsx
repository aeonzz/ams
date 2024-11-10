"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { H1, H4, H5, P } from "@/components/typography/text";
import SearchInput from "@/app/(app)/_components/search-input";
import FetchDataError from "@/components/card/fetch-data-error";
import NotFound from "@/app/not-found";
import VenueAuditLogTable from "./venue-audit-log-table";
import { ChevronLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import VenueAuditLogSkeleton from "./venue-audit-log-skeleton";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";

interface VenueLogsScreenProps {
  venueId: string;
}

export default function VenueLogsScreen({ venueId }: VenueLogsScreenProps) {
  const router = useRouter();
  const [globalFilter, setGlobalFilter] = React.useState("");
  const { data, isLoading, refetch, isError, error } = useQuery<
    GenericAuditLogRelations[]
  >({
    queryFn: async () => {
      const res = await axios.get(`/api/audit-log/venue-log/${venueId}`);
      return res.data.data;
    },
    queryKey: ["venue-logs", venueId],
  });

  if (isLoading)
    return (
      <DataTableSkeleton
        columnCount={6}
        searchableColumnCount={1}
        filterableColumnCount={0}
        cellWidths={["10rem", "30rem", "12rem", "12rem", "8rem"]}
        shrinkZero
      />
    );
  if (isError && axios.isAxiosError(error) && error.response?.status === 404) {
    return <NotFound />;
  }
  if (isError || !data) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <FetchDataError refetch={refetch} />
      </div>
    );
  }
  const formattedData = data.map((log) => ({
    ...log,
    firstName: log.changedBy?.firstName,
    middleName: log.changedBy?.middleName,
    lastName: log.changedBy?.lastName,
  }));

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-[50px] items-center justify-between border-b px-3">
        <div className="flex items-center gap-1">
          <Button variant="ghost2" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="size-4" />
          </Button>
          <H5 className="truncate font-semibold">Facility Logs</H5>
        </div>
        <SearchInput />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between p-3 pb-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 transform text-muted-foreground" />
            <Input
              placeholder="Search"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="max-w-sm pl-8"
            />
          </div>
        </div>
        <div className="scroll-bar min-h-[calc(100vh_-_150px)] overflow-y-auto">
          <VenueAuditLogTable
            data={formattedData}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        </div>
      </div>
    </div>
  );
}
