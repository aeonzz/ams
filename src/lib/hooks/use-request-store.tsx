import { create } from "zustand";
import {
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import axios from "axios";
import { RequestWithRelations } from "prisma/generated/zod";
import { useEffect } from "react";
import { socket } from "@/app/socket";

interface RequestState {
  request: RequestWithRelations | null;
  setRequest: (request: RequestWithRelations | null) => void;
}

const useRequestStore = create<RequestState>((set) => ({
  request: null,
  setRequest: (request: RequestWithRelations | null) => set({ request }),
}));

export function useRequest(id: string): UseQueryResult<
  RequestWithRelations,
  Error
> & {
  globalRequest: RequestWithRelations | null;
} {
  const queryClient = useQueryClient();
  const { request: globalRequest, setRequest } = useRequestStore();

  useEffect(() => {
    socket.on("request_update", () => {
      queryClient.invalidateQueries({ queryKey: [id] });
    });

    return () => {
      socket.off("request_update");
    };
  }, []);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("yawa",data.queryKey);
      if (data.type === "INVALIDATE_QUERIES") {
        if (data.queryKey.includes(id)) {
          queryClient.invalidateQueries({ queryKey: [id] });
          socket.emit("notifications");
          socket.emit("request_update");
        }
      }
    };

    return () => {
      ws.close();
    };
  }, [queryClient, id]);

  const query = useQuery<RequestWithRelations, Error>({
    queryKey: [id],
    queryFn: async () => {
      const res = await axios.get(`/api/request/get-request/${id}`);
      const data = res.data.data;
      setRequest(data);
      return data;
    },
  });

  return { ...query, globalRequest };
}

export const getGlobalRequest = () => useRequestStore.getState().request;
