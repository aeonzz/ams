"use client";

import { format } from "date-fns";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Truck,
  FileText,
  AlertTriangle,
  MessageSquare,
  Plus,
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
  getPriorityIcon,
  getRequestTypeIcon,
  getStatusColor,
  textTransform,
} from "@/lib/utils";
import RequestActions from "./request-actions";
import SupplyItemCard from "./supply-item-card";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import RequestDetailsSkeleton from "./request-details-skeleton";
import SearchInput from "@/app/(app)/_components/search-input";
import JobRequestDetails from "./job-request-details";
import JobRequestReviewerActions from "./job-request-reviewer-actions";
import { useSession } from "@/lib/hooks/use-session";
import { useRequest } from "@/lib/hooks/use-request-store";
import { ClientRoleGuard } from "@/components/client-role-guard";
import { PermissionGuard } from "@/components/permission-guard";

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

  const PrioIcon = getPriorityIcon(data.priority);
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
                <Badge variant="outline">
                  <PrioIcon className="mr-1 h-4 w-4" />
                  {textTransform(data.priority)}
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
                <P>Department: {data.user.department?.name}</P>
              </div>
            </div>
            <Separator className="my-6" />
            {data.type === "JOB" && data.jobRequest && (
              <JobRequestDetails data={data.jobRequest} />
            )}
            {data.type === "VENUE" && data.venueRequest && (
              <div className="space-y-4">
                <H4 className="font-semibold text-muted-foreground">
                  Venue Request Details
                </H4>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <P>Venue: {data.venueRequest.venue.name}</P>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <P>
                    Start:{" "}
                    {format(new Date(data.venueRequest.startTime), "PPP p")}
                  </P>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <P>
                    End: {format(new Date(data.venueRequest.endTime), "PPP p")}
                  </P>
                </div>
                <div>
                  <H5 className="mb-2 font-semibold text-muted-foreground">
                    Setup Requirements:
                  </H5>
                  <ul className="ml-4 mt-2 list-disc">
                    {data.venueRequest.setupRequirements
                      .split(", ")
                      .map((requirement, index) => (
                        <li key={index} className="mb-1 text-sm">
                          {requirement}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
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
            {data.type === "RESOURCE" && data.returnableRequest && (
              <div className="space-y-4">
                <H4 className="font-semibold text-muted-foreground">
                  Supply Request Details
                </H4>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <P className="underline underline-offset-4">
                    Needed By:{" "}
                    {format(
                      new Date(data.returnableRequest.dateAndTimeNeeded),
                      "PPP p"
                    )}
                  </P>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <P className="underline underline-offset-4">
                    Return By:{" "}
                    {format(
                      new Date(data.returnableRequest.returnDateAndTime),
                      "PPP p"
                    )}
                  </P>
                </div>
                <div>
                  <H5 className="mb-2 font-semibold text-muted-foreground">
                    Item:
                  </H5>
                  <ul className="list-inside list-disc">
                    {/* {data.supplyRequest.items.map((item) => (
                      <ItemCard key={item.id} supplyRequest={item} />
                    ))} */}
                  </ul>
                </div>
                <div>
                  <H5 className="mb-2 font-semibold text-muted-foreground">
                    Purpose:
                  </H5>
                  <P>{data.returnableRequest.purpose}</P>
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
      <div className="w-[320px] space-y-6 p-6">
        <div>
          <H4 className="mb-2 font-semibold">Request Summary</H4>
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
            <div>
              <P className="mb-1 text-sm">Priority</P>
              <Badge variant="outline">
                <PrioIcon className="mr-2 h-4 w-4" />
                {textTransform(data.priority)}
              </Badge>
            </div>
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
            {data.type === "JOB" && data.jobRequest && (
              <div>
                <P className="mb-1 text-sm">Assigned to</P>
                <div className="flex items-center space-x-2 p-1">
                  <Avatar className="size-5 rounded-full">
                    <AvatarImage src={`${data.user.profileUrl}` ?? ""} />
                    <AvatarFallback className="rounded-md">
                      {data.user.firstName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <P>
                    {data.jobRequest.assignedUser
                      ? formatFullName(
                          data.user.firstName,
                          data.user.middleName,
                          data.user.lastName
                        )
                      : "N/A"}
                  </P>
                </div>
              </div>
            )}
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-3">
          {currentUser.id === data.userId && (
            <RequestActions data={data} params={params} />
          )}
          {data.type === "JOB" && data.jobRequest && (
            <PermissionGuard
              allowedRoles={["REQUEST_REVIEWER"]}
              allowedSection={data.jobRequest.sectionId}
              currentUser={currentUser}
            >
              <JobRequestReviewerActions request={data} />
            </PermissionGuard>
          )}
        </div>
      </div>
    </div>
  );
}
