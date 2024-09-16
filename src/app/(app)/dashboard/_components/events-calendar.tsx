"use client";

import ShadcnBigCalendar from "@/components/big-calendar/big-calendar";
import React from "react";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { momentLocalizer, Views } from "react-big-calendar";

const DnDCalendar = withDragAndDrop(ShadcnBigCalendar);
const localizer = momentLocalizer(moment);

export default function EvensCalendar() {
  const [view, setView] = React.useState(Views.WEEK);
  const [date, setDate] = React.useState(new Date());

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const handleViewChange = (newView: React.SetStateAction<any>) => {
    setView(newView);
  };
  return (
    <div className="px-3">
      <DnDCalendar
        localizer={localizer}
        style={{ height: 600, width: "100%" }}
        selectable
        date={date}
        onNavigate={handleNavigate}
        view={view}
        onView={handleViewChange}
        resizable
        draggableAccessor={() => true}
        resizableAccessor={() => true}
      />
    </div>
  );
}
