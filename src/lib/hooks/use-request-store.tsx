import { create } from "zustand";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";
import { RequestWithRelations } from "prisma/generated/zod";

interface RequestState {
  request: RequestWithRelations | null;
  setRequest: (request: RequestWithRelations | null) => void;
}

const useRequestStore = create<RequestState>((set) => ({
  request: null,
  setRequest: (request: RequestWithRelations | null) => set({ request }),
}));

export function useRequest(
  id: string
): UseQueryResult<RequestWithRelations, Error> & {
  globalRequest: RequestWithRelations | null;
} {
  const { request: globalRequest, setRequest } = useRequestStore();

  const query = useQuery<RequestWithRelations, Error>({
    queryKey: [id],
    queryFn: async () => {
      const res = await axios.get(`/api/request/${id}`);
      const data = res.data.data;
      setRequest(data);
      return data;
    },
  });

  return { ...query, globalRequest };
}

export const getGlobalRequest = () => useRequestStore.getState().request;
