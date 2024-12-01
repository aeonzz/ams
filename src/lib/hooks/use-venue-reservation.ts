import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { ReservedDatesAndTimes } from "../schema/utils";

interface UseVenueReservedDatesParams {
  venueId?: string;
}

export function useVenueReservedDates({ venueId }: UseVenueReservedDatesParams) {
  const { data, isLoading, refetch, isRefetching, isError } = useQuery<
    ReservedDatesAndTimes[]
  >({
    queryFn: async () => {
      if (!venueId) return [];
      const res = await axios.get(`/api/reserved-dates/venue/${venueId}`);
      return res.data.data;
    },
    queryKey: ["venue-reserved-dates", venueId],
    enabled: !!venueId,
  });

  const disabledTimeRanges = React.useMemo(() => {
    return (
      data
        ?.filter((item) => item.request.status === "APPROVED")
        .map(({ startTime, endTime }) => ({
          start: new Date(startTime),
          end: new Date(endTime),
        })) ?? []
    );
  }, [data]);

  return {
    data,
    disabledTimeRanges,
    isLoading,
    refetch,
    isRefetching,
    isError
  };
}
