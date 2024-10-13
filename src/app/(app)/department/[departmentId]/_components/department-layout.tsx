"use client";

import { P } from "@/components/typography/text";
import React from "react";
import OverviewNavigationMenu from "./navigation-menu";
import SearchInput from "@/app/(app)/_components/search-input";
import { useDepartmentData } from "@/lib/hooks/use-department-data";
import FetchDataError from "@/components/card/fetch-data-error";

interface DepartmentLayoutProps {
  departmentId: string;
  children: React.ReactNode;
}

export default function DepartmentLayout({
  departmentId,
  children,
}: DepartmentLayoutProps) {
  const { data, isLoading, isError, refetch } = useDepartmentData(departmentId);

  if (isLoading) {
    return <p>...loding</p>;
  }

  if (isError || !data) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <FetchDataError refetch={refetch} />
      </div>
    );
  }
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-[50px] items-center justify-between border-b px-3">
        <P className="font-medium">{data.name}</P>
        <div className="flex items-center gap-2">
          <OverviewNavigationMenu data={data} />
          <SearchInput />
        </div>
      </div>
      <div className="scroll-bar flex flex-1 justify-center overflow-y-auto p-3">
        {children}
      </div>
    </div>
  );
}
