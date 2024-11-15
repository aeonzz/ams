import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { DepartmentWithRelations } from "prisma/generated/zod";
import { pusherClient } from "../pusher-client";

export const useDepartmentData = (departmentId: string) => {
  const queryClient = useQueryClient();

  React.useEffect(() => {
    const channel = pusherClient.subscribe("request");
    channel.bind("request_update", (data: { message: string }) => {
      queryClient.invalidateQueries({
        queryKey: [departmentId],
      });
    });

    return () => {
      pusherClient.unsubscribe("request");
    };
  }, []);

  return useQuery<DepartmentWithRelations>({
    queryKey: [departmentId],
    queryFn: async () => {
      const res = await axios.get(
        `/api/department/get-department-by-id/${departmentId}`
      );
      return res.data.data;
    },
  });
};
