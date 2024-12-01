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
  Briefcase,
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
import SupplyRequestActions from "./supply-request-actions";
import TransportRequestActions from "./transport-request-actions";
import CancelRequest from "./cancel-request";
import VenueRequestActions from "./venue-request-actions";
import PriorityOption from "@/app/(app)/dashboard/_components/priority-option";
import SetPriority from "./set-priority";
import { ScrollArea } from "@/components/ui/scroll-area";
import VerifyJob from "./verify-job";
import { PermissionGuard } from "@/components/permission-guard";
import { ClientRoleGuard } from "@/components/client-role-guard";
import VenueChairApproval from "./venue-chair-approval";

interface RequestDetailsProps {
  params: string;
}

export default function RequestDetails({ params }: RequestDetailsProps) {
  const currentUser = useSession();
  const dialogManager = useDialogManager();
  const { data, isLoading, isError, refetch } = useRequest(params);

  if (isLoading) return <RequestDetailsSkeleton />;
  if (isError) return <FetchDataError refetch={refetch} />;
  if (!data) return <NotFound />;

  const statusColor = getStatusColor(data.status);
  const RequestTypeIcon = getRequestTypeIcon(data.type);
  return (
    <div className="flex h-full w-full">
      <div className="flex-1 overflow-hidden">
        <div className="flex h-[50px] items-center gap-16 border-b px-6">
          <H5 className="truncate font-semibold text-muted-foreground">
            {params}
          </H5>
          <SearchInput />
        </div>
        <ScrollArea className="h-[calc(100vh_-_75px)]">
          <div className="flex justify-center px-10 py-10">
            <div className="h-auto w-full max-w-3xl">
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
                  <P>
                    Date requested: {format(new Date(data.createdAt), "PPP p")}
                  </P>
                </div>
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5" />
                  <P>Department: {data.department.name}</P>
                </div>
              </div>
              <Separator className="my-6" />
              {data.type === "JOB" && data.jobRequest && (
                <JobRequestDetails
                  data={data.jobRequest}
                  requestId={data.id}
                  rejectionReason={data.rejectionReason}
                  cancellationReason={data.cancellationReason}
                  onHoldReason={data.onHoldReason}
                  requestStatus={data.status}
                  isCurrentUser={currentUser.id === data.userId}
                  allowedDepartment={data.departmentId}
                />
              )}
              {data.type === "VENUE" && data.venueRequest && (
                <VenueRequestDetails
                  data={data.venueRequest}
                  requestId={data.id}
                  rejectionReason={data.rejectionReason}
                  cancellationReason={data.cancellationReason}
                  onHoldReason={data.onHoldReason}
                  requestStatus={data.status}
                  isCurrentUser={currentUser.id === data.userId}
                  completedAt={data.completedAt}
                  departmentId={data.departmentId}
                />
              )}
              {data.type === "BORROW" && data.returnableRequest && (
                <ReturnableResourceDetails
                  data={data.returnableRequest}
                  requestId={data.id}
                  rejectionReason={data.rejectionReason}
                  cancellationReason={data.cancellationReason}
                  onHoldReason={data.onHoldReason}
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
                  departmentId={data.departmentId}
                />
              )}
              {data.type === "TRANSPORT" && data.transportRequest && (
                <TransportRequestDetails
                  data={data.transportRequest}
                  requestId={data.id}
                  rejectionReason={data.rejectionReason}
                  cancellationReason={data.cancellationReason}
                  onHoldReason={data.onHoldReason}
                  requestStatus={data.status}
                  isCurrentUser={currentUser.id === data.userId}
                  completedAt={data.completedAt}
                />
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
      <Separator orientation="vertical" className="h-full" />
      <ScrollArea className="w-[320px] px-6 py-2">
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
              data.status !== "PENDING" && (
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
            {data.type === "JOB" && data.jobRequest && (
              <SetPriority
                prio={data.jobRequest.priority}
                requestId={data.id}
                disabled={data.status === "COMPLETED"}
                allowedDepartment={data.departmentId}
              />
            )}
          </div>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col gap-3">
          {currentUser.id === data.userId && (
            <CancelRequest
              requestId={data.id}
              requestStatus={data.status}
              disabled={
                data.transportRequest?.inProgress ||
                data.venueRequest?.inProgress ||
                (data.jobRequest ? data.jobRequest.status !== "PENDING" : false)
              }
            />
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
            <>
              <JobRequestReviewerActions
                request={data}
                allowedDepartment={data.departmentId}
                allowedRoles={["OPERATIONS_MANAGER", "DEPARTMENT_HEAD"]}
                jobRequestId={data.jobRequest.id}
              />
              {!data.jobRequest.verifiedByRequester &&
                data.jobRequest.status === "COMPLETED" &&
                data.userId === currentUser.id && (
                  <VerifyJob
                    jobRequestId={data.jobRequest.id}
                    role="requester"
                    requestId={data.id}
                  />
                )}
            </>
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
              allowedRoles={["OPERATIONS_MANAGER", "DEPARTMENT_HEAD"]}
              allowedDepartment={data.departmentId}
              allowedApproverRoles={["DEPARTMENT_HEAD"]}
              inProgress={data.returnableRequest.inProgress}
            >
              {data.status === "APPROVED" ||
                (data.status === "ON_HOLD" && (
                  <ClientRoleGuard allowedRoles={["OPERATIONS_MANAGER"]}>
                    <CancelRequest
                      requestId={data.id}
                      disabled={data.returnableRequest.inProgress}
                      requestStatus={data.status}
                    />
                  </ClientRoleGuard>
                ))}
            </RequestReviewerActions>
          )}
          {data.type === "SUPPLY" && data.supplyRequest && (
            <RequestReviewerActions
              request={data}
              allowedRoles={["OPERATIONS_MANAGER", "DEPARTMENT_HEAD"]}
              allowedDepartment={data.departmentId}
              allowedApproverRoles={["DEPARTMENT_HEAD"]}
            />
          )}
          {data.type === "TRANSPORT" && data.transportRequest && (
            <RequestReviewerActions
              request={data}
              allowedRoles={["OPERATIONS_MANAGER", "DEPARTMENT_HEAD"]}
              allowedDepartment={data.departmentId}
              allowedApproverRoles={["DEPARTMENT_HEAD"]}
              actionNeeded={
                new Date(data.transportRequest.dateAndTimeNeeded) <=
                  new Date() &&
                !data.transportRequest.inProgress &&
                data.status === "APPROVED"
              }
              inProgress={data.transportRequest.inProgress}
            >
              {data.status === "APPROVED" ||
                (data.status === "ON_HOLD" && (
                  <ClientRoleGuard allowedRoles={["OPERATIONS_MANAGER"]}>
                    <CancelRequest
                      requestId={data.id}
                      disabled={data.transportRequest.inProgress}
                      requestStatus={data.status}
                    />
                  </ClientRoleGuard>
                ))}
              {new Date(data.transportRequest.dateAndTimeNeeded) <=
                new Date() &&
                !data.transportRequest.inProgress &&
                data.status === "APPROVED" && (
                  <TransportRequestActions data={data.transportRequest} />
                )}
            </RequestReviewerActions>
          )}
          {data.type === "VENUE" &&
            data.venueRequest &&
            data.venueRequest.approvedByHead === true && (
              <RequestReviewerActions
                request={data}
                allowedRoles={["OPERATIONS_MANAGER", "DEPARTMENT_HEAD"]}
                allowedDepartment={data.departmentId}
                allowedApproverRoles={["DEPARTMENT_HEAD"]}
                inProgress={data.venueRequest.inProgress}
                actionNeeded={
                  new Date(data.venueRequest.startTime) <= new Date() &&
                  !data.venueRequest.inProgress &&
                  data.status === "APPROVED"
                }
              >
                {new Date(data.venueRequest.startTime) <= new Date() &&
                  !data.venueRequest.inProgress &&
                  data.status === "APPROVED" && (
                    <VenueRequestActions
                      requestId={data.id}
                      departmentId={data.departmentId}
                    />
                  )}
                {(data.status === "APPROVED" || data.status === "ON_HOLD") && (
                  <ClientRoleGuard allowedRoles={["OPERATIONS_MANAGER"]}>
                    <CancelRequest
                      requestId={data.id}
                      disabled={data.venueRequest.inProgress}
                      requestStatus={data.status}
                    />
                  </ClientRoleGuard>
                )}
              </RequestReviewerActions>
            )}
          {data.type === "VENUE" && data.venueRequest && (
            <>
              {data.venueRequest.approvedByHead === null &&
                data.status === "PENDING" && (
                  <VenueChairApproval
                    data={data.venueRequest}
                    requestId={data.id}
                  />
                )}
              {data.venueRequest.inProgress && (
                <CompleteVenueRequest
                  requestId={data.id}
                  departmentId={data.departmentId}
                />
              )}
            </>
          )}
          {data.type === "TRANSPORT" &&
            data.transportRequest &&
            data.transportRequest.inProgress && (
              <CompleteTransportRequest
                requestId={data.id}
                initialOdometer={data.transportRequest.vehicle.odometer}
              />
            )}
          {data.status === "APPROVED" &&
            data.type === "BORROW" &&
            data.returnableRequest &&
            new Date(data.returnableRequest.dateAndTimeNeeded) <=
              new Date() && (
              <ReturnableRequestActions
                allowedRoles={["OPERATIONS_MANAGER"]}
                allowedDepartment={data.departmentId}
                request={data.returnableRequest}
                requestId={data.id}
              />
            )}
          {data.status === "APPROVED" &&
            data.type === "SUPPLY" &&
            data.supplyRequest && (
              <SupplyRequestActions
                requestId={data.id}
                allowedRoles={["OPERATIONS_MANAGER", "DEPARTMENT_HEAD"]}
                allowedDepartment={data.departmentId}
              />
            )}
        </div>
      </ScrollArea>
    </div>
  );
}
