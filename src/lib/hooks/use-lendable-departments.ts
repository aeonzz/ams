import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Department } from "prisma/generated/zod";

export const useLendableDepartments = () => {
  return useQuery<Department[]>({
    queryFn: async () => {
      const res = await axios.get("/api/department/get-lendable-departments");
      return res.data.data;
    },
    queryKey: ["get-supply-departments"],
  });
};
