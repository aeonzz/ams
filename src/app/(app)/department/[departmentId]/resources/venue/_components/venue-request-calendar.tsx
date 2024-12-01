"use client";

import ShadcnBigCalendar from "@/components/big-calendar/big-calendar";
import React from "react";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { dateFnsLocalizer, Views } from "react-big-calendar";
import { enUS } from "date-fns/locale/en-US";
import { format, getDay, parse, startOfWeek } from "date-fns";
import { VenueRequestCalendarType } from "./types";
import VenueRequestCalendarDetailCard from "./venue-request-calendar-detail-card";

const locales = {
  "en-US": enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});
const DnDCalendar = withDragAndDrop(ShadcnBigCalendar);

interface VenueRequestCalendarProps {
  data: VenueRequestCalendarType[] | undefined;
}

export default function VenueRequestCalendar({
  data,
}: VenueRequestCalendarProps) {
  const [view, setView] = React.useState(Views.MONTH);
  const [date, setDate] = React.useState(new Date());

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const handleViewChange = (newView: React.SetStateAction<any>) => {
    setView(newView);
  };
  
  const events = data?.map((item) => ({
    title: item.title,
    start: new Date(item.startTime),
    end: new Date(item.endTime),
    allDay: false,
    resource: item,
  }));

  return (
    <div className="mt-1 w-full overflow-hidden rounded-md border">
      <ShadcnBigCalendar
        localizer={localizer}
        events={events}
        style={{
          height: 550,
          width: "100%",
        }}
        selectable
        date={date}
        onNavigate={handleNavigate}
        view={view}
        onView={handleViewChange}
        components={{
          event: VenueRequestCalendarDetailCard,
        }}
        tooltipAccessor={null}
      />
    </div>
  );
}
