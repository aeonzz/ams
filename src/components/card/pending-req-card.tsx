import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { Briefcase, Calendar, Clock } from "lucide-react";
import { H3, H4, H5, P } from "../typography/text";
import { RequestJoin } from "@/lib/types/request";
import { format } from "date-fns";

interface PendingReqCardProps {
  data: RequestJoin;
}

export default function PendingReqCard({ data }: PendingReqCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Clock className="size-5" />
            <H5 className="font-semibold">{data.title}</H5>
          </div>
          <Badge variant="secondary">{`${data.status.charAt(0)}${data.status.slice(1).toLowerCase()}`}</Badge>
        </div>
        <div className="grid gap-2">
          {/* <P className="text-muted-foreground">{`${data.jo.slice(0, 70)}...`}</P> */}
        </div>
        <div className="mr-2 flex w-fit items-center space-x-2">
          <Briefcase className="size-4 text-primary" />
          <P>{`${data.type.charAt(0)}${data.type.slice(1).toLowerCase()}`}</P>
        </div>
        <div className="mr-2 flex w-fit items-center space-x-2">
          <Calendar className="size-4 text-primary" />
          <P>{`Submitted on ${format(new Date(data.createdAt), "PPP")}`}</P>
        </div>
        <div className="flex space-x-1">
          <Badge variant="secondary">{data.jobRequest?.jobType}</Badge>
        </div>
      </CardHeader>
    </Card>
  );
}
