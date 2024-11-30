"use client";

import ShadcnBigCalendar from "@/components/big-calendar/big-calendar";
import React from "react";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { dateFnsLocalizer, Views } from "react-big-calendar";
import { format, getDay, parse, startOfWeek } from "date-fns";
import { enUS } from "date-fns/locale/en-US";

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

export default function EvensCalendar() {
  const [view, setView] = React.useState(Views.MONTH);
  const [date, setDate] = React.useState(new Date());

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const handleViewChange = (newView: React.SetStateAction<any>) => {
    setView(newView);
  };

  return (
    <div className="">
      <ShadcnBigCalendar
        localizer={localizer}
        style={{ height: 500, width: "100%" }}
        selectable
        date={date}
        onNavigate={handleNavigate}
        view={view}
        onView={handleViewChange}
      />
    </div>
  );
}
