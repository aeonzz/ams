"use client";

import React from "react";

interface ManageVenueScreenProps {
  params: {
    departmentId: string;
    venueId: string;
  };
}

export default function InventorySubItemsScreen({
  params,
}: ManageVenueScreenProps) {
  const { departmentId, venueId } = params;
  return <div>InventorySubItemsScreen</div>;
}
