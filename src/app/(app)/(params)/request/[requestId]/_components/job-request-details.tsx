"use client";

import LoadingSpinner from "@/components/loaders/loading-spinner";
import { H4, H5, P } from "@/components/typography/text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CommandShortcut } from "@/components/ui/command";
import CommandTooltip from "@/components/ui/command-tooltip";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { fillJobRequestEvaluationPDF } from "@/lib/fill-pdf/job-evaluation";
import {
  cn,
  formatFullName,
  getChangeTypeInfo,
  getJobStatusColor,
  textTransform,
} from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import {
  Calendar,
  Circle,
  CircleMinus,
  CirclePlus,
  Clock,
  Dot,
  Download,
  FileText,
  MapPin,
  RotateCw,
  Timer,
  User,
} from "lucide-react";
import Image from "next/image";
import {
  GenericAuditLog,
  type JobRequestWithRelations,
} from "prisma/generated/zod";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { toast } from "sonner";

interface JobRequestDetailsProps {
  data: JobRequestWithRelations;
  requestId: string;
}

export default function JobRequestDetails({
  data,
  requestId,
}: JobRequestDetailsProps) {
  const { data: logs, isLoading } = useQuery<GenericAuditLog[]>({
    queryFn: async () => {
      const res = await axios.get(`/api/audit-log/request-log/${requestId}`);
      return res.data.data;
    },
    queryKey: ["activity", requestId],
  });

  const JobStatusColor = getJobStatusColor(data.status);
  const isEvaluated = data.jobRequestEvaluation !== null;

  const handleDownloadEvaluation = async () => {
    const generateAndDownloadPDF = async () => {
      if (data.jobRequestEvaluation) {
        try {
          const pdfBlob = await fillJobRequestEvaluationPDF(
            data.jobRequestEvaluation
          );
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

  useHotkeys(
    "ctrl+shift+d",
    (event) => {
      event.preventDefault();
      handleDownloadEvaluation();
    },
    { enableOnFormTags: false, enabled: data.jobRequestEvaluation !== null }
  );

  return (
    <>
      <div className="space-y-4">
        <div className="flex h-7 items-center justify-between">
          <H4 className="font-semibold text-muted-foreground">
            Job Request Details
          </H4>
          {isEvaluated && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost2"
                  size="icon"
                  className="size-7"
                  onClick={handleDownloadEvaluation}
                >
                  <Download className="size-4 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="flex items-center gap-3" side="bottom">
                <CommandTooltip text="Download evaluation form">
                  <CommandShortcut>Ctrl</CommandShortcut>
                  <CommandShortcut>Shift</CommandShortcut>
                  <CommandShortcut>D</CommandShortcut>
                </CommandTooltip>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <P>Job type: {textTransform(data.jobType)}</P>
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <P>Location: {data.location}</P>
        </div>
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <P>
            Assigned To:{" "}
            {data.assignedUser
              ? formatFullName(
                  data.assignedUser.firstName,
                  data.assignedUser.middleName,
                  data.assignedUser.lastName
                )
              : "-"}
          </P>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <P>Due date: {format(new Date(data.dueDate), "PPP p")}</P>
        </div>
        <div className="flex items-center space-x-2">
          <Timer className="h-5 w-5" />
          <P>
            Estimated time:{" "}
            {data.estimatedTime ? `${data.estimatedTime} hours` : "-"}
          </P>
        </div>
        <div className="flex items-center space-x-2">
          <Circle className="h-5 w-5" />
          <P className="inline-flex gap-3">
            Job status:{" "}
            <Badge variant={JobStatusColor.variant} className="pr-3.5">
              <Dot
                className="mr-1 size-3"
                strokeWidth={JobStatusColor.stroke}
                color={JobStatusColor.color}
              />
              {textTransform(data.status)}
            </Badge>
          </P>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <P>
            Start date/time:{" "}
            {data.startDate ? format(new Date(data.startDate), "PPP p") : "-"}
          </P>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <P>
            End date/time:{" "}
            {data.endDate ? format(new Date(data.endDate), "PPP p") : "-"}
          </P>
        </div>
        <div>
          <H5 className="mb-2 font-semibold text-muted-foreground">
            Job Description:
          </H5>
          <P className="text-wrap break-all">{data.description}</P>
        </div>
        <PhotoProvider
          speed={() => 300}
          maskOpacity={0.5}
          loadingElement={<LoadingSpinner />}
          toolbarRender={({ onScale, scale, rotate, onRotate }) => {
            return (
              <>
                <div className="flex gap-3">
                  <CirclePlus
                    className="size-5 cursor-pointer opacity-75 transition-opacity ease-linear hover:opacity-100"
                    onClick={() => onScale(scale + 1)}
                  />
                  <CircleMinus
                    className="size-5 cursor-pointer opacity-75 transition-opacity ease-linear hover:opacity-100"
                    onClick={() => onScale(scale - 1)}
                  />
                  <RotateCw
                    className="size-5 cursor-pointer opacity-75 transition-opacity ease-linear hover:opacity-100"
                    onClick={() => onRotate(rotate + 90)}
                  />
                </div>
              </>
            );
          }}
        >
          <div>
            {data.files.map((file) => (
              <PhotoView key={file.id} src={file.url}>
                <div
                  key={file.id}
                  className="relative mb-3 w-full cursor-pointer"
                >
                  <Image
                    src={file.url}
                    alt={`Image of ${file.url}`}
                    placeholder="empty"
                    quality={100}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="h-auto w-full rounded-sm border object-contain"
                  />
                </div>
              </PhotoView>
            ))}
          </div>
        </PhotoProvider>
      </div>
      <Separator className="my-6" />
      <div className="space-y-4 pb-20">
        <H4 className="font-semibold">Activity</H4>
        {isLoading ? (
          <>
            {[...Array(2)].map((_, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </>
        ) : (
          <div className="space-y-4">
            {logs?.map((activity) => {
              const {
                color,
                icon: Icon,
                message,
              } = getChangeTypeInfo(activity.changeType);
              return (
                <div key={activity.id} className="flex items-center space-x-2">
                  <Icon className="size-5" color={color} />
                  <P className="inline-flex items-center text-muted-foreground">
                    {message}
                    <Dot /> {format(new Date(activity.timestamp), "MMM d")}
                  </P>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
