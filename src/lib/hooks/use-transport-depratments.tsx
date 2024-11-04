import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Department } from "prisma/generated/zod";

export const useTransportDepartments = () => {
  return useQuery<Department[]>({
    queryFn: async () => {
      const res = await axios.get("/api/department/get-transport-departments");
      return res.data.data;
    },
    queryKey: ["get-transport-departments"],
  });
};
