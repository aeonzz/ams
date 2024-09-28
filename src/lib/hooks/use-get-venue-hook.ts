import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { VenueWithRelations } from "prisma/generated/zod";

export function useGetVenue(venueId: string) {
  const { data, isLoading, isError, error, refetch } = useQuery<
    VenueWithRelations,
    Error
  >({
    queryKey: ["venue-details", venueId],
    queryFn: async () => {
      const response = await axios.get<{ data: VenueWithRelations }>(
        `/api/venue/get-venue/${venueId}`
      );
      return response.data.data;
    },
  });

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
  };
}
