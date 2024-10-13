import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { DepartmentWithRelations } from "prisma/generated/zod";

export const useDepartmentData = (departmentId: string) => {
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
