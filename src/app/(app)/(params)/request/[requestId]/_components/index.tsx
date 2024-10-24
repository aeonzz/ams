"use client";

import React from "react";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  MapPin,
  Truck,
  AlertTriangle,
  Link as LinkIcon,
  Dot,
  Link,
} from "lucide-react";
import NotFound from "@/app/not-found";
import FetchDataError from "@/components/card/fetch-data-error";
import { H2, H3, H4, H5, P } from "@/components/typography/text";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  cn,
  formatFullName,
  getJobStatusColor,
  getPriorityIcon,
  getRequestTypeIcon,
  getStatusColor,
  textTransform,
} from "@/lib/utils";
import RequestActions from "./request-actions";
import SupplyItemCard from "./supply-item-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import RequestDetailsSkeleton from "./request-details-skeleton";
import SearchInput from "@/app/(app)/_components/search-input";
import JobRequestDetails from "./job-request-details";
import JobRequestReviewerActions from "./job-request-reviewer-actions";
import { useSession } from "@/lib/hooks/use-session";
import { useRequest } from "@/lib/hooks/use-request-store";
import VenueRequestDetails from "./venue-request-details";
import ReturnableResourceDetails from "./returnable-resource-details";
import PersonnelActions from "./personnel-actions";
import { Button } from "@/components/ui/button";
import { useDialogManager } from "@/lib/hooks/use-dialog-manager";
import JobRequestEvaluationDialog from "@/components/dialogs/job-request-evaluation-dialog";
import RequestSummaryTitle from "./request-summary-title";
import TransportRequestDetails from "./transport-request-details";
import RequestReviewerActions from "./request-reviewer-actions";
import CompleteVenueRequest from "./complete-venue-request";
import CompleteTransportRequest from "./complete-transport-request";
import ReturnableRequestActions from "./returnable-request-actions";
import SupplyResourceDetails from "./supply-resource-details";

interface RequestDetailsProps {
  params: string;
}

export default function RequestDetails({ params }: RequestDetailsProps) {
  const currentUser = useSession();
  const dialogManager = useDialogManager();
  const { data, isLoading, isError, refetch, globalRequest } =
    useRequest(params);

  if (isLoading) return <RequestDetailsSkeleton />;
  if (isError) return <FetchDataError refetch={refetch} />;
  if (!data) return <NotFound />;

  const statusColor = getStatusColor(data.status);
  const RequestTypeIcon = getRequestTypeIcon(data.type);
  console.log(data);
  return (
    <div className="flex h-full w-full">
      <div className="flex-1 overflow-hidden">
        <div className="flex h-[50px] items-center gap-16 border-b px-6">
          <H5 className="truncate font-semibold text-muted-foreground">
            {data.title}
          </H5>
          <SearchInput />
        </div>
        <div className="scroll-bar flex h-[calc(100vh_-_75px)] justify-center overflow-y-auto px-10 py-10">
          <div className="h-auto w-[750px]">
            <div className="mb-6">
              <H2 className="mb-3 font-semibold">{data.title}</H2>
              <div className="mb-4 flex items-center space-x-2">
                <Badge variant={RequestTypeIcon.variant}>
                  <RequestTypeIcon.icon className="mr-1 h-4 w-4" />
                  {textTransform(data.type)}
                </Badge>
                <Badge variant={statusColor.variant} className="pr-3.5">
                  <Dot
                    className="mr-1 size-3"
                    strokeWidth={statusColor.stroke}
                    color={statusColor.color}
                  />
                  {textTransform(data.status)}
                </Badge>
              </div>
              <P className="mb-2 text-muted-foreground">
                Request details for {data.type.toLowerCase()} request.
              </P>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Avatar className="size-5 rounded-full">
                  <AvatarImage src={`${data.user.profileUrl}`} />
                  <AvatarFallback className="rounded-md">
                    {data.user.firstName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <P>
                  Requested by:{" "}
                  {formatFullName(
                    data.user.firstName,
                    data.user.middleName,
                    data.user.lastName
                  )}
                </P>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <P>Created: {format(new Date(data.createdAt), "PPP p")}</P>
              </div>
            </div>
            <Separator className="my-6" />
            {data.type === "JOB" && data.jobRequest && (
              <JobRequestDetails
                data={data.jobRequest}
                requestId={data.id}
                rejectionReason={data.rejectionReason}
                requestStatus={data.status}
                isCurrentUser={currentUser.id === data.userId}
              />
            )}
            {data.type === "VENUE" && data.venueRequest && (
              <VenueRequestDetails
                data={data.venueRequest}
                requestId={data.id}
                rejectionReason={data.rejectionReason}
                requestStatus={data.status}
                isCurrentUser={currentUser.id === data.userId}
              />
            )}
            {data.type === "BORROW" && data.returnableRequest && (
              <ReturnableResourceDetails
                data={data.returnableRequest}
                requestId={data.id}
                rejectionReason={data.rejectionReason}
                requestStatus={data.status}
                isCurrentUser={currentUser.id === data.userId}
              />
            )}
            {data.type === "SUPPLY" && data.supplyRequest && (
              <SupplyResourceDetails
                data={data.supplyRequest}
                requestId={data.id}
                rejectionReason={data.rejectionReason}
                requestStatus={data.status}
                isCurrentUser={currentUser.id === data.userId}
              />
            )}
            {data.type === "TRANSPORT" && data.transportRequest && (
              <TransportRequestDetails
                data={data.transportRequest}
                requestId={data.id}
                rejectionReason={data.rejectionReason}
                requestStatus={data.status}
                isCurrentUser={currentUser.id === data.userId}
              />
            )}
          </div>
        </div>
      </div>
      <Separator orientation="vertical" className="h-full" />
      <div className="w-[320px] p-6 pt-0">
        <RequestSummaryTitle />
        <div>
          <div className="space-y-4">
            <div>
              <P className="mb-1 text-sm">Request</P>
              <Badge variant={RequestTypeIcon.variant}>
                <RequestTypeIcon.icon className="mr-2 h-4 w-4" />
                {textTransform(data.type)}
              </Badge>
            </div>
            <div>
              <P className="mb-1 text-sm">Status</P>
              <Badge variant={statusColor.variant} className="pr-3.5">
                <Dot
                  className="mr-1 size-3"
                  strokeWidth={statusColor.stroke}
                  color={statusColor.color}
                />
                {textTransform(data.status)}
              </Badge>
            </div>
            {data.type === "JOB" &&
              data.jobRequest &&
              (data.status === "APPROVED" || data.status === "COMPLETED") && (
                <div>
                  <P className="mb-1 text-sm">Job Status</P>
                  {(() => {
                    const JobStatusColor = getJobStatusColor(
                      data.jobRequest.status
                    );
                    return (
                      <Badge
                        variant={JobStatusColor.variant}
                        className="pr-3.5"
                      >
                        <Dot
                          className="mr-1 size-3"
                          strokeWidth={JobStatusColor.stroke}
                          color={JobStatusColor.color}
                        />
                        {textTransform(data.jobRequest.status)}
                      </Badge>
                    );
                  })()}
                </div>
              )}
            <div>
              <P className="mb-1 text-sm">Requested by</P>
              <div className="flex items-center space-x-2 p-1">
                <Avatar className="size-5 rounded-full">
                  <AvatarImage src={`${data.user.profileUrl}`} />
                  <AvatarFallback className="rounded-md">
                    {data.user.firstName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <P>
                  {formatFullName(
                    data.user.firstName,
                    data.user.middleName,
                    data.user.lastName
                  )}
                </P>
              </div>
            </div>
            {data.reviewer && (
              <div>
                <P className="mb-1 text-sm">Reviewed by</P>
                <div className="flex items-center space-x-2 p-1">
                  <Avatar className="size-5 rounded-full">
                    <AvatarImage src={`${data.reviewer.profileUrl}`} />
                    <AvatarFallback className="rounded-md">
                      {data.reviewer.firstName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <P>
                    {data.reviewer
                      ? formatFullName(
                          data.reviewer.firstName,
                          data.reviewer.middleName,
                          data.reviewer.lastName
                        )
                      : "N/A"}
                  </P>
                </div>
              </div>
            )}
            {data.type === "JOB" && data.jobRequest?.assignedUser && (
              <div>
                <P className="mb-1 text-sm">Assigned to</P>
                <div className="flex items-center space-x-2 p-1">
                  <Avatar className="size-5 rounded-full">
                    <AvatarImage
                      src={`${data.jobRequest.assignedUser.profileUrl}`}
                    />
                    <AvatarFallback className="rounded-md">
                      {data.jobRequest.assignedUser.firstName
                        .charAt(0)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <P>
                    {data.jobRequest.assignedUser
                      ? formatFullName(
                          data.jobRequest.assignedUser.firstName,
                          data.jobRequest.assignedUser.middleName,
                          data.jobRequest.assignedUser.lastName
                        )
                      : "N/A"}
                  </P>
                </div>
              </div>
            )}
          </div>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col gap-3">
          {currentUser.id === data.userId && (
            <RequestActions data={data} params={data.id} entityType="OTHER" />
          )}
          {data.type === "JOB" &&
            data.jobRequest &&
            !data.jobRequest.jobRequestEvaluation &&
            data.status === "COMPLETED" &&
            currentUser.id === data.userId && (
              <JobRequestEvaluationDialog
                jobRequestId={data.jobRequest.id}
                requestId={data.id}
              >
                <Button
                  onClick={() =>
                    dialogManager.setActiveDialog("jobRequestEvaluationDialog")
                  }
                >
                  Evaluation
                </Button>
              </JobRequestEvaluationDialog>
            )}
          {data.type === "JOB" && data.jobRequest && (
            <JobRequestReviewerActions
              request={data}
              allowedDepartment={data.departmentId}
              allowedRoles={["REQUEST_MANAGER"]}
              allowedApproverRoles={["DEPARTMENT_HEAD"]}
            />
          )}
          {data.type === "JOB" &&
            data.jobRequest &&
            data.jobRequest.assignedTo === currentUser.id &&
            data.status === "APPROVED" && (
              <PersonnelActions
                requestId={data.id}
                allowedDepartment={data.departmentId}
                allowedRoles={["PERSONNEL"]}
                data={data.jobRequest}
              />
            )}
          {data.type === "BORROW" && data.returnableRequest && (
            <RequestReviewerActions
              request={data}
              allowedRoles={["REQUEST_MANAGER"]}
              allowedDepartment={data.departmentId}
              allowedApproverRoles={["DEPARTMENT_HEAD"]}
            />
          )}
          {data.type === "TRANSPORT" && data.transportRequest && (
            <RequestReviewerActions
              request={data}
              allowedRoles={["REQUEST_MANAGER"]}
              allowedDepartment={data.departmentId}
              allowedApproverRoles={["DEPARTMENT_HEAD"]}
            />
          )}
          {data.type === "VENUE" && data.venueRequest && (
            <RequestReviewerActions
              request={data}
              allowedRoles={["REQUEST_MANAGER"]}
              allowedDepartment={data.departmentId}
              allowedApproverRoles={["DEPARTMENT_HEAD"]}
            />
          )}
          {data.type === "VENUE" &&
            data.venueRequest &&
            data.venueRequest.inProgress && (
              <CompleteVenueRequest requestId={data.id} />
            )}
          {data.type === "TRANSPORT" &&
            data.transportRequest &&
            data.transportRequest.inProgress && (
              <CompleteTransportRequest requestId={data.id} />
            )}
          {data.status === "APPROVED" &&
            data.type === "BORROW" &&
            data.returnableRequest && (
              <ReturnableRequestActions
                request={data.returnableRequest}
                requestId={data.id}
              />
            )}
          {/* {data.type === "VENUE" && data.venueRequest && (
            <JobRequestReviewerActions
              request={data}
              entityType="RETURNABLE_REQUEST"
              allowedRoles={[""]}
              allowedSection={data.venueRequest.sectionId}
              allowedApproverRoles={["DEPARTMENT_HEAD"]}
              requestTypeId={data.venueRequest.id}
            />
          )} */}
        </div>
      </div>
    </div>
  );
}
