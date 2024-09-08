import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Truck,
  Package,
  Dot,
} from "lucide-react";
import { format } from "date-fns";
import { type RequestWithRelations } from "prisma/generated/zod";
import { cn, getStatusColor, textTransform } from "@/lib/utils";
import { P } from "@/components/typography/text";
import Link from "next/link";

interface VenueRequestCardProps {
  request: RequestWithRelations;
}

export default function VenueRequestCard({ request }: VenueRequestCardProps) {
  const { color, stroke, variant } = getStatusColor(request.status);
  return (
    <Card className="bg-secondary">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <P className="asd font-medium">{request.title}</P>
          <Badge variant={variant} className="pr-3.5">
            <Dot className={cn("mr-1 size-3", color)} strokeWidth={stroke} />
            {textTransform(request.status)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            <P className="asd font-medium">
              {request.venueRequest?.venue.name}
            </P>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            <P className="asd font-medium">
              {request.venueRequest?.startTime
                ? format(new Date(request.venueRequest.startTime), "PPP")
                : "No start time available"}
            </P>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            <P className="asd font-medium">
              {request.venueRequest?.startTime &&
              request.venueRequest?.endTime ? (
                <>
                  {format(new Date(request.venueRequest.startTime), "p")} -{" "}
                  {format(new Date(request.venueRequest.endTime), "p")}
                </>
              ) : (
                "Time not available"
              )}
            </P>
          </div>
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            <P className="asd font-medium">
              Capacity: {request.venueRequest?.venue.capacity}
            </P>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          {request.venueRequest?.purpose}
        </p>
      </CardContent>
      <CardFooter>
        <Link
          href={`/request/${request.id}`}
          className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
        >
          <P>View Details</P>
        </Link>
      </CardFooter>
    </Card>
  );
}
