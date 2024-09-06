"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
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
} from "lucide-react";
import { RequestWithRelations } from "prisma/generated/zod";
import NotFound from "@/app/not-found";
import FetchDataError from "@/components/card/fetch-data-error";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import { H2, H3, H4, H5, P } from "@/components/typography/text";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  getPriorityIcon,
  getRequestTypeIcon,
  getStatusIcon,
  textTransform,
} from "@/lib/utils";
import RequestActions from "./request-actions";
import SupplyItemCard from "./supply-item-card";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import RequestDetailsSkeleton from "./request-details-skeleton";
import SearchInput from "@/app/(app)/_components/search-input";

interface RequestDetailsProps {
  params: string;
}

export default function RequestDetails({ params }: RequestDetailsProps) {
  const { data, isLoading, refetch, isError } = useQuery<RequestWithRelations>({
    queryFn: async () => {
      const res = await axios.get(`/api/request/${params}`);
      return res.data.data;
    },
    queryKey: ["user-request-details", params],
  });

  if (isLoading) return <RequestDetailsSkeleton />;
  if (isError) return <FetchDataError refetch={refetch} />;
  if (!data) return <NotFound />;

  const PrioIcon = getPriorityIcon(data.priority);
  const StatusIcon = getStatusIcon(data.status);
  const RequestTypeIcon = getRequestTypeIcon(data.type);

  return (
    <div className="flex h-full w-full">
      <div className="flex-1 overflow-hidden">
        <div className="flex h-[50px] items-center border-b px-6">
          <H5 className="font-semibold text-muted-foreground">{data.title}</H5>
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
                <Badge variant={StatusIcon.variant}>
                  <StatusIcon.icon className="mr-1 h-4 w-4" />
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
                    {data.user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <P>Requested by: {data.user.username}</P>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <P>Created: {format(new Date(data.createdAt), "PPP p")}</P>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <P>Department: {data.department}</P>
              </div>
            </div>
            <Separator className="my-6" />
            {data.type === "JOB" && data.jobRequest && (
              <div className="space-y-4">
                <H4 className="font-semibold text-muted-foreground">
                  Job Request Details
                </H4>
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <P>Job Type: {data.jobRequest.jobType}</P>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <P>Assigned To: {data.jobRequest.assignTo}</P>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <P>
                    Due Date:{" "}
                    {format(new Date(data.jobRequest.dueDate), "PPP p")}
                  </P>
                </div>
                <div>
                  <H5 className="mb-2 font-semibold text-muted-foreground">
                    Notes:
                  </H5>
                  <P>{data.jobRequest.notes}</P>
                </div>
                <div>
                  {data.jobRequest.files.map((file) => (
                    <div key={file.id} className="relative mb-3 w-full">
                      <Image
                        src={file.url}
                        alt={`Image of ${file.url}`}
                        quality={100}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="h-auto w-full rounded-sm border object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
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
                  <ul className="mt-2 list-disc ml-4">
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
            <Separator className="my-6" />
            <div className="space-y-4 pb-20">
              <H4 className="font-semibold">Activity</H4>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="h-6 w-6 rounded-full bg-blue-500" />
                  <P className="text-sm">
                    <span className="font-semibold">System</span> created the
                    request · {format(new Date(data.createdAt), "MMM d")}
                  </P>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-6 w-6 rounded-full bg-green-500" />
                  <P className="text-sm">
                    <span className="font-semibold">System</span> updated the
                    description of the request ·{" "}
                    {format(new Date(data.updatedAt), "MMM d")}
                  </P>
                </div>
              </div>
            </div>
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
              <Badge variant={StatusIcon.variant}>
                <StatusIcon.icon className="mr-2 h-4 w-4" />
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
                    {data.user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <P>{data.user.username}</P>
              </div>
            </div>
          </div>
        </div>
        <Separator className="" />
        <RequestActions data={data} params={params} />
      </div>
    </div>
  );
}
