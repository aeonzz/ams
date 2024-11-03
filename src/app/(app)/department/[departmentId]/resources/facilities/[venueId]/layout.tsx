import RequestOption from "@/app/(app)/dashboard/_components/request-option";
import { ManageVenueStatusDialog } from "./_components/manage-venue-status-dialog";

export interface Props {
  params: {
    departmentId: string;
    venueId: string;
  };
  children: React.ReactNode;
}

export default function CommandLayout({ children, params }: Props) {
  return (
    <>
      <ManageVenueStatusDialog
        venueId={params.venueId}
        queryKey={[params.venueId]}
      />
      <RequestOption />
      {children}
    </>
  );
}
