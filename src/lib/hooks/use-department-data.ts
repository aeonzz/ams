import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { DepartmentWithRelations } from "prisma/generated/zod";
import { socket } from "@/app/socket";

export const useDepartmentData = (departmentId: string) => {
  const queryClient = useQueryClient();
  React.useEffect(() => {
    const handleUpdate = () => {
      queryClient.invalidateQueries({
        queryKey: ["department", departmentId],
      });
    };

    socket.on("request_update", handleUpdate);

    return () => {
      socket.off("request_update", handleUpdate);
    };
  }, []);

  return useQuery<DepartmentWithRelations>({
    queryKey: ["department", departmentId],
    queryFn: async () => {
      const res = await axios.get(
        `/api/department/get-department-by-id/${departmentId}`
      );
      return res.data.data;
    },
  });
};
