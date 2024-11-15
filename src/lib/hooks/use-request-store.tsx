import React from "react";
import {
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import axios from "axios";
import { RequestWithRelations } from "prisma/generated/zod";
import { pusherClient } from "../pusher-client";

export function useRequest(
  id: string
): UseQueryResult<RequestWithRelations, Error> {
  const queryClient = useQueryClient();
  // Handle query for fetching request data

  // Set up Pusher to listen for updates
  React.useEffect(() => {
    const channel = pusherClient.subscribe("request");
    channel.bind("request_update", (data: { message: string }) => {
      console.log(data.message);
      queryClient.invalidateQueries({ queryKey: [id] });
    });

    return () => {
      pusherClient.unsubscribe("request");
    };
  }, []);

  const query = useQuery<RequestWithRelations, Error>({
    queryKey: [id],
    queryFn: async () => {
      const res = await axios.get(`/api/request/get-request/${id}`);
      return res.data.data;
    },
  });

  // React.useEffect(() => {
  //   const ws = new WebSocket("ws://localhost:8080");

  //   ws.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     if (data.type === "INVALIDATE_QUERIES") {
  //       if (data.queryKey.includes(id)) {
  //         query.refetch();
  //       }
  //     }
  //   };

  //   return () => {
  //     ws.close();
  //   };
  // }, [id]);

  return query;
}
