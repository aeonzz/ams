import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Department } from "prisma/generated/zod";

export const useDepartments = () => {
  return useQuery<Department[]>({
    queryFn: async () => {
      const res = await axios.get("/api/department/get-departments");
      return res.data.data;
    },
    queryKey: ["get-departments"],
  });
};
