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
import AddEstimatedTime from "./add-estimated-time";
import PersonnelActions from "./personnel-actions";

interface RequestDetailsProps {
  params: string;
}

export default function RequestDetails({ params }: RequestDetailsProps) {
  const currentUser = useSession();
  const { data, isLoading, isError, refetch, globalRequest } =
    useRequest(params);

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
                  <AvatarImage src={`${data.user.profileUrl}` ?? ""} />
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
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <P>Department:</P>
                {data.user.userDepartments.map((department) => (
                  <P key={department.id}>{department.department.name}</P>
                ))}
              </div>
            </div>
            <Separator className="my-6" />
            {data.type === "JOB" && data.jobRequest && (
              <JobRequestDetails data={data.jobRequest} requestId={data.id} />
            )}
            {data.type === "VENUE" && data.venueRequest && (
              <VenueRequestDetails data={data.venueRequest} />
            )}
            {data.type === "RESOURCE" && data.returnableRequest && (
              <ReturnableResourceDetails data={data.returnableRequest} />
            )}
            {data.type === "RESOURCE" && data.supplyRequest && (
              <div className="space-y-4">
                <H4 className="font-semibold text-muted-foreground">
                  Supply Request Details
                </H4>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <P className="underline underline-offset-4">
                    Needed By:{" "}
                    {format(
                      new Date(data.supplyRequest.dateAndTimeNeeded),
                      "PPP p"
                    )}
                  </P>
                </div>
                <div>
                  <H5 className="mb-2 font-semibold text-muted-foreground">
                    Items:
                  </H5>
                  <ul className="list-inside list-disc">
                    {data.supplyRequest.items.map((item) => (
                      <SupplyItemCard key={item.id} supplyRequest={item} />
                    ))}
                  </ul>
                </div>
                <div>
                  <H5 className="mb-2 font-semibold text-muted-foreground">
                    Purpose:
                  </H5>
                  <P>{data.supplyRequest.purpose}</P>
                </div>
              </div>
            )}
            {data.type === "TRANSPORT" && data.transportRequest && (
              <div className="space-y-4">
                <H4 className="">Transport Request Details</H4>
                <div className="flex items-center space-x-2">
                  <Truck className="h-5 w-5" />
                  <P>Vehicle: {data.transportRequest.vehicle.name}</P>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <P>Destination: {data.transportRequest.destination}</P>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <P>
                    Needed By:{" "}
                    {format(
                      new Date(data.transportRequest.dateAndTimeNeeded),
                      "PPP p"
                    )}
                  </P>
                </div>
                <div>
                  <H5 className="mb-2">Description:</H5>
                  <P>{data.transportRequest.description}</P>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Separator orientation="vertical" className="h-full" />
      <div className="w-[320px] p-6 pt-0">
        <div className="py-2.5">
          <H4 className="font-semibold text-muted-foreground">
            Request Summary
          </H4>
        </div>
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
            {data.type === "JOB" && data.status !== "CANCELLED" && (
              <AddEstimatedTime data={data} />
            )}
            {data.type === "JOB" &&
              data.status === "APPROVED" &&
              data.jobRequest && (
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
                  <AvatarImage src={`${data.user.profileUrl}` ?? ""} />
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
            {data.type === "JOB" && data.jobRequest?.assignedUser && (
              <div>
                <P className="mb-1 text-sm">Assigned to</P>
                <div className="flex items-center space-x-2 p-1">
                  <Avatar className="size-5 rounded-full">
                    <AvatarImage
                      src={`${data.jobRequest.assignedUser.profileUrl}` ?? ""}
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
            <RequestActions data={data} params={params} />
          )}
          {data.type === "JOB" && data.jobRequest && (
            <JobRequestReviewerActions
              request={data}
              entityType="JOB_REQUEST"
              showPersonnels
              allowedRoles={["REQUEST_REVIEWER"]}
              allowedApproverRoles={["DEPARTMENT_HEAD"]}
              requestTypeId={data.jobRequest.id}
            />
          )}
          {data.type === "JOB" && data.jobRequest && (
            <PersonnelActions
              requestId={params}
              allowedDepartment={data.departmentId}
              allowedRoles={["PERSONNEL"]}
              data={data.jobRequest}
            />
          )}
          {data.type === "RESOURCE" && data.returnableRequest && (
            <JobRequestReviewerActions
              request={data}
              entityType="RETURNABLE_REQUEST"
              allowedRoles={["REQUEST_REVIEWER", "REQUEST_MANAGER"]}
              allowedDepartment={data.returnableRequest.departmentId}
              allowedApproverRoles={["DEPARTMENT_HEAD"]}
              requestTypeId={data.returnableRequest.id}
            />
          )}
          {/* {data.type === "VENUE" && data.venueRequest && (
            <JobRequestReviewerActions
              request={data}
              entityType="RETURNABLE_REQUEST"
              allowedRoles={["REQUEST_REVIEWER"]}
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
