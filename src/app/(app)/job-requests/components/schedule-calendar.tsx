"use client";

import ShadcnBigCalendar from "@/components/big-calendar/big-calendar";
import React from "react";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { dateFnsLocalizer, Views } from "react-big-calendar";
import enUS from "date-fns/locale/en-US";
import { format, getDay, parse, startOfWeek } from "date-fns";

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

export default function ScheduleCalendar() {
  const [view, setView] = React.useState(Views.MONTH);
  const [date, setDate] = React.useState(new Date());

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const handleViewChange = (newView: React.SetStateAction<any>) => {
    setView(newView);
  };

  return (
    <div className="mt-1">
      <ShadcnBigCalendar
        localizer={localizer}
        style={{
          height: 400,
          width: "100%",
        }}
        selectable
        date={date}
        onNavigate={handleNavigate}
        view={view}
        onView={handleViewChange}
      />
    </div>
  );
}
