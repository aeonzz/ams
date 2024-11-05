import { useState, useEffect } from "react";
import { AlertCard } from "@/components/ui/alert-card";
import { Separator } from "@/components/ui/separator";

interface RejectionReasonCardProps {
  rejectionReason: string | null;
}

export default function RejectionReasonCard({
  rejectionReason,
}: RejectionReasonCardProps) {
  if (!rejectionReason) return null;

  return (
    <div>
      <AlertCard
        variant="destructive"
        title="Request Rejected"
        description={rejectionReason}
      />
      <Separator className="my-6" />
    </div>
  );
}
