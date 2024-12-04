"use client";

import NotFound from "@/app/not-found";
import FetchDataError from "@/components/card/fetch-data-error";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import { Button } from "@/components/ui/button";
import { useRequest } from "@/lib/hooks/use-request-store";
import { useSession } from "@/lib/hooks/use-session";
import JobRequestEvaluationDialog from "@/components/dialogs/job-request-evaluation-dialog";
import React from "react";
import ContentLayout from "@/components/layouts/content-layout";
import { H3, H5 } from "@/components/typography/text";
import MenuSheet from "@/app/(app)/dashboard/_components/menu-sheet";
import SearchInput from "@/app/(app)/_components/search-input";
import { useMediaQuery } from "usehooks-ts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle } from "lucide-react";

interface EvaluationPageProps {
  params: {
    requestId: string;
  };
}

export default function EvaluationPage({ params }: EvaluationPageProps) {
  const currentUser = useSession();
  const isDesktop = useMediaQuery("(min-width: 769px)");
  const { data, isLoading, isError, refetch } = useRequest(params.requestId);

  return (
    <ContentLayout title="Requests">
      {isLoading && (
        <div className="grid place-items-center">
          <LoadingSpinner />
        </div>
      )}
      {isError && <FetchDataError refetch={refetch} />}
      {!data && !isLoading && !isError && <NotFound />}

      {data && (
        <div className="h-full w-full">
          <div className="flex h-[50px] items-center border-b px-3">
            {!isDesktop && <MenuSheet />}
            <H5 className="truncate font-semibold text-muted-foreground">
              {params.requestId}
            </H5>
            <SearchInput />
          </div>

          <ScrollArea className="h-[calc(100vh_-_55px)] lg:h-[calc(100vh_-_70px)]">
            {data.type !== "JOB" && <NotFound />}

            {data.type === "JOB" &&
              data.jobRequest &&
              data.jobRequest.jobRequestEvaluation && (
                <div className="grid h-[calc(100vh_-_55px)] place-items-center p-4 text-center text-muted-foreground lg:h-[calc(100vh_-_70px)]">
                  <div className="flex flex-col items-center gap-4">
                    <CheckCircle className="h-12 w-12" />
                    <H3>This request has already been evaluated.</H3>
                  </div>
                </div>
              )}

            {data.type === "JOB" &&
              data.jobRequest &&
              !data.jobRequest.jobRequestEvaluation &&
              data.status !== "COMPLETED" && <NotFound />}

            {data.type === "JOB" &&
              data.jobRequest &&
              !data.jobRequest.jobRequestEvaluation &&
              data.status === "COMPLETED" &&
              currentUser.id === data.userId && (
                <JobRequestEvaluationDialog
                  jobRequestId={data.jobRequest.id}
                  requestId={data.id}
                />
              )}
          </ScrollArea>
        </div>
      )}
    </ContentLayout>
  );
}
